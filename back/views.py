# -*- coding: utf8 -*-
from django.shortcuts import render, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from back.models import *
import Image, ImageDraw, ImageFont, ImageFilter, random#PIL插件的文件
from hashlib import sha1
from datetime import datetime
from django.conf import settings
import cStringIO#用于把生成的图片写入内存
import platform#用于判断操作系统
import json
# Create your views here.
def l3admin(request):
    return render_to_response('admin.html')

def getCAPTCHA(request):
    sh = sha1()
    sh.update(str(datetime.now()))
    sh_src = sh.hexdigest()
    code = sh_src[0:4]
    #string = {'number':'12345679','litter':'ACEFGHKMNPRTUVWXY'}
    background = (random.randrange (230,255),random.randrange(230,255),random.randrange(230,255))
    line_color = ['red', 'blue', 'yellow', 'green', 'brown']
    img_width = 103
    img_height = 30 
    font_color = ['black','red', 'blue', 'green', 'brown']
    point_color = ['red', 'blue', 'yellow', 'green', 'brown']
    font_size = 25

    nowsys = platform.system()
    if nowsys == 'Darwin':
        font = ImageFont.truetype('/Library/Fonts/Arial.ttf',font_size)
    elif nowsys == 'Windows':
        font = ImageFont.truetype('Arial.ttf',font_size)
    else:
        return HttpResponse('system Error From getCAPTCHA---->nowsys')
    #新建画布
    im = Image.new('RGB',(img_width,img_height),background)
    draw = ImageDraw.Draw(im)
    #code = random.sample(string['litter'],4)
    #新建画笔
    draw = ImageDraw.Draw(im)
    #干扰点(90表示10%的概率)
    for w in range(img_width):
        for h in range(img_height):
            tmp = random.randrange(1,100)
            if tmp > 90:
                draw.point((w, h), fill=(random.choice(point_color)))
    #画干扰线
    for i in range(random.randrange(5,8)):
        xy = (random.randrange(0,img_width),random.randrange(0,img_height),
              random.randrange(0,img_width),random.randrange(0,img_height))
        draw.line(xy,fill=(random.choice(line_color)),width=1)
    #写入验证码文字
    x = 10
    for i in code:
        y = random.randrange(0,7)
        draw.text((x,y), i, font=font, fill=random.choice(font_color))
        x += 20
    del x
    del draw
    params = [1 - float(random.randint(1, 2)) / 100,
                  0,
                  0,
                  0,
                  1 - float(random.randint(1, 10)) / 100,
                  float(random.randint(1, 2)) / 500,
                  0.001,
                  float(random.randint(1, 2)) / 500
                  ]
    im = im.transform((120,42), Image.PERSPECTIVE, params) # 创建扭曲
    buf = cStringIO.StringIO()
    im.save(buf, 'gif')
    request.session['CAPTCHA'] = code
    #print code
    #print request.session['CAPTCHA']
    return HttpResponse(buf.getvalue(), 'image/gif')

def regist(request):
    username = request.POST['account']
    password = request.POST['password']
    validcode = request.POST['validcode']

    if validcode != request.session['CAPTCHA']:
        jsonObject = json.dumps({'validcode':'验证码错误!'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")

    user_exist = User.objects.filter(UserName__exact=username)
    if user_exist:
        jsonObject = json.dumps({'account':'账号已存在!'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")

    del request.session['CAPTCHA']
    nt = datetime.now()
    shpw = sha1()
    shpw.update(password + str(nt)[0:19])
    pw = shpw.hexdigest()
    userobj = User()
    userobj.UserName = username
    userobj.PassWord = pw
    userobj.Permission = 0
    userobj.Time = nt
    userobj.save()
    request.session['userid'] = userobj.id
    request.session['permission']= 0
    jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def login(request):
    username = request.POST['account']
    password = request.POST['password']
    validcode = request.POST['validcode']
    
    if validcode != request.session['CAPTCHA']:
        jsonObject = json.dumps({'validcode':'验证码错误!'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")

    try:
        user_data = User.objects.get(UserName = username)
    except User.DoesNotExist:
        jsonObject = json.dumps({'account':'账号不存在，请确认!'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")

    shpw = sha1()
    shpw.update(password + str(user_data.Time)[0:19])
    spw = shpw.hexdigest()
    if spw != user_data.PassWord:
        jsonObject = json.dumps({'password':'密码错误请重新输入!'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    else:
        del request.session['CAPTCHA']
        request.session['userid'] = user_data.id
        request.session['permission'] = user_data.Permission
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")

def logout(request):
    del request.session['userid']
    del request.session['permission']
    return HttpResponseRedirect('/')

def permission(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        del request.session['userid']
        del request.session['permission']
        return HttpResponse('请等待管理员授权。')
    elif userPermission == '':
        return HttpResponseRedirect('/l3admin')
    else:
        return HttpResponseRedirect('/l3back')

#==================================================================================
#后台登录注册页和后台管理的分割线
#==================================================================================

def l3back(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponseRedirect('/l3admin')
    elif userPermission == 1:
        return render_to_response('gree_backup.html', {'permission':''})
    elif userPermission == 2:
        return render_to_response('gree_backup.html', {'permission':'Y'})
    else:
        return HttpResponseRedirect('/l3admin')

#+----------+=====================================================================
#|账号处理模块|=====================================================================
#+----------+=====================================================================
def getAccount(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 2:
        return HttpResponse('Without Permission')

    userinfo = []
    userobjs = User.objects.all()
    for userobj in userobjs:
        userinfo.append(dict(account = userobj.UserName, permission = userobj.Permission))
    jsonObject = json.dumps({'userinfo':userinfo},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def manageAccount(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 2:
        return HttpResponse('Without Permission')

    manage = request.POST['manage']
    if manage == 'delete':
        account = request.POST['account']
        userobj = User.objects.get(UserName = account)
        userobj.delete()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'edit':
        account = request.POST['account']
        permission = request.POST['permission']
        userobj = User.objects.get(UserName = account)
        userobj.Permission = int(permission)
        userobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。')

#+----------+=====================================================================
#|产品处理模块|=====================================================================
#+----------+=====================================================================
def getClassOne(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    classonels = []
    classoneobjls = ClassOne.objects.all().order_by('Sequence')
    for classoneobj in classoneobjls:
        classonels.append(classoneobj.ClassName)
    jsonObject = json.dumps({'classone':classonels},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def manageClassOne(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    manage = request.POST['manage']
    if manage == 'add':
        classname = request.POST['classname']
        classoneobj = ClassOne()
        classoneobj.ClassName = classname
        classoneobj.SubClassNum = 0
        classoneobj.Sequence = len(ClassOne.objects.all())
        classoneobj.ProductCount = 0
        classoneobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'delete':
        classname = request.POST['classname']
        classoneobj = ClassOne.objects.get(ClassName = classname)
        BestProduct.objects.filter(ClassOne = classoneobj).delete()
        ProductInfoPic.objects.filter(ClassOne = classoneobj).delete()
        ProductPic.objects.filter(ClassOne = classoneobj).delete()
        Products.objects.filter(ClassOne = classoneobj).delete()
        ClassTwo.objects.filter(PreClass = classoneobj).delete()
        classoneobj.delete()
        #重新调整顺序。
        classoneobjls = ClassOne.objects.all().order_by('Sequence')
        i = 0
        for classoneobj in classoneobjls:
            classoneobj.Sequence = i
            i += 1
            classoneobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'edit':
        classname = request.POST['classname']
        oldname = request.POST['oldname']
        classoneobj = ClassOne.objects.get(ClassName = oldname)
        classoneobj.ClassName = classname
        classoneobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'sort':
        sequence = request.POST['sequence']
        sequencels = sequence.split('#')
        i = 0
        for classname in sequencels:
            classoneobj = ClassOne.objects.get(ClassName = classname)
            classoneobj.Sequence = i
            classoneobj.save()
            i += 1
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。')

def getClassTwo(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    classone = request.POST['classone']
    classoneobj = ClassOne.objects.get(ClassName = classone)
    classtwols = []
    classtwoobjls = ClassTwo.objects.filter(ClassOne = classoneobj).order_by('Sequence')
    for classtwoobj in classtwoobjls:
        classtwols.append(classtwoobj.ClassName)
    jsonObject = json.dumps({'classtwo':classtwols},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def manageClassTwo(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    manage = request.POST['manage']
    if manage == 'add':
        classone = request.POST['classone']
        classname = request.POST['classname']
        classoneobj = ClassOne.objects.get(ClassName = classone)
        classoneobj.SubClassNum += 1
        classtwoobj = ClassTwo()
        classtwoobj.PreClass = classoneobj
        classtwoobj.Sequence = len(ClassTwo.objects.filter(PreClass = classoneobj))
        classtwoobj.ProductCount = 0
        classoneobj.save()
        classtwoobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'delete':
        classone = request.POST['classone']
        classname = request.POST['classname']
        classoneobj = ClassOne.objects.get(ClassName = classone)
        classoneobj.SubClassNum -= 1
        classtwoobj = ClassTwo.objects.get(ClassName = classname)
        BestProduct.objects.filter(ClassOne = classoneobj, ClassTwo = classtwoobj).delete()
        ProductInfoPic.objects.filter(ClassOne = classoneobj, ClassTwo = classtwoobj).delete()
        ProductPic.objects.filter(ClassOne = classoneobj, ClassTwo = classtwoobj).delete()
        Products.objects.filter(ClassOne = classoneobj, ClassTwo = classtwoobj).delete()
        classoneobj.save()
        classtwoobj.delete()
        #重新调整二级类的顺序
        classtwoobjls = ClassTwo.objects.filter(PreClass = classoneobj).order_by('Sequence')
        i = 0
        for classtwoobj in classtwoobjls:
            classtwoobj.Sequence = i
            i += 1
            classtwoobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'edit':
        classone = request.POST['classone']
        classname = request.POST['classname']
        oldname = request.POST['oldname']
        classoneobj = ClassOne.objects.get(ClassName = classone)
        classtwoobj = ClassTwo.objects.get(ClassName = oldname, PreClass = classoneobj)
        classtwoobj.ClassName = classname
        classtwoobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'sort':
        classone = request.POST['classone']
        sequence = request.POST['sequence']
        classoneobj = ClassOne.objects.get(ClassName = classone)
        sequencels = sequence.split('#')
        i = 0
        for classname in sequencels:
            classtwoobj = ClassTwo.objects.get(PreClass = classoneobj, ClassName = classname)
            classtwoobj.Sequence = i
            classtwoobj.save()
            i += 1
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。') 

def getProduct(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    classone = request.POST['classone']
    classtwo = request.POST['classtwo']
    classoneobj = ClassOne.objects.get(ClassName = classone)
    classtwoobj = ClassTwo.objects.get(PreClass = classoneobj, ClassName = classtwo)
    productls = []
    productobjls = Products.objects.filter(ClassOne = classoneobj, ClassTwo = classtwoobj).order_by('Sequence')
    for productobj in productobjls:
        productls.append(productobj.ProductName)
    jsonObject = json.dumps({'products':productls},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def getProductInfo(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')
    
    classone = request.POST['classone']
    classtwo = request.POST['classtwo']
    product = request.POST['product']

    classoneobj = ClassOne.objects.get(ClassName = classone)
    classtwoobj = ClassTwo.objects.get(PreClass = classoneobj, ClassName = classtwo)
    productobj = Products.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, ProductName = product)
    productpicls = []
    productpicobjls = ProductPic.objects.filter(ClassOne = classoneobj, ClassTwo = classtwoobj, Product = productobj).order_by('Sequence')
    for productpicobj in productpicobjls:
        productpicls.append(productpicobj.ImageName)
    jsonObject = json.dumps({'productpic':productpicls, 'content':productobj.ProductInfo, 'productinfo':productobj.ProductInfoContent},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def manageProduct(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    manage = request.POST['manage']
    if manage == 'add':
        classone = request.POST['classone']
        classtwo = request.POST['classtwo']
        productname = request.POST['productname']
        classoneobj = ClassOne.objects.get(ClassName = classone)
        classtwoobj = ClassTwo.objects.get(PreClass = classoneobj, ClassName = classtwo)
        classoneobj.ProductCount += 1
        classtwoobj.ProductCount += 1
        productobj = Products()
        productobj.ClassOne = classoneobj
        productobj.ClassTwo = classtwoobj
        productobj.ProductName = productname
        productobj.ProductInfo = ''
        productobj.ProductInfoContent = ''
        productobj.Sequence = len(Products.objects.filter(ClassOne = classoneobj, ClassTwo = classtwoobj))
        productobj.save()
        classoneobj.save()
        classtwoobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'delete':
        classone = request.POST['classone']
        classtwo = request.POST['classtwo']
        productname = request.POST['productname']
        classoneobj = ClassOne.objects.get(ClassName = classone)
        classtwoobj = ClassTwo.objects.get(PreClass = classoneobj, ClassName = classtwo)
        classoneobj.ProductCount -= 1
        classtwoobj.ProductCount -= 1
        productobj = Products.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, ProductName = productname)
        BestProduct.objects.filter(ClassOne = classoneobj, ClassTwo = classtwoobj, Product = productobj).delete()
        ProductInfoPic.objects.filter(ClassOne = classoneobj, ClassTwo = classtwoobj, Product = productobj).delete()
        ProductPic.objects.filter(ClassOne = classoneobj, ClassTwo = classtwoobj, Product = productobj).delete()
        productobj.delete()
        classoneobj.save()
        classtwoobj.save()
        #对产品重新排序。
        productobjls = Products.objects.filter(ClassOne = classoneobj, ClassTwo= classtwoobj).order_by('Sequence')
        i = 0
        for productobj in productobjls:
            productobj.Sequence = i
            i += 1
            productobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'edit':
        classone = request.POST['classone']
        classtwo = request.POST['classtwo']
        productname = request.POST['productname']
        oldname = request.POST['oldname']
        classoneobj = ClassOne.objects.get(ClassName = classone)
        classtwoobj = ClassTwo.objects.get(ClassName = classtwo, PreClass = classoneobj)
        productobj = Products.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, ProductName = oldname)
        productobj.ProductName = productname
        productobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'sort':
        classone = request.POST['classone']
        classtwo = request.POST['classtwo']
        sequence = request.POST['sequence']
        classoneobj = ClassOne.objects.get(ClassName = classone)
        classtwoobj = ClassTwo.objects.get(ClassName = classtwo, PreClass = classoneobj)
        sequencels = sequence.split('#')
        i = 0
        for productname in sequencels:
            productobj = Products.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, ProductName = productname)
            productobj.Sequence = i
            productobj.save()
            i += 1
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。') 

def manageProductPic(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    if manage == 'add':
        if 'pic' in request.FILES:
            classone = request.POST['classone']
            classtwo = request.POST['classtwo']
            productname = request.POST['productname']
            pic =request.FILES['pic']
            classoneobj = ClassOne.objects.get(ClassName = classone)
            classtwoobj = ClassTwo.objects.get(ClassName = classtwo, PreClass = classoneobj)
            productobj = Products.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, ProductName = productname)
            t = int(time.time())
            rn = random.randrange(1,10000)
            addName = 'pp_' + str(t) + str(rn)#pp_用于区分图片
            picName = pic.name
            #以下代码替换掉文件名中的空格，改为下划线，有空格的文件名在存入mysql时会自动转化为下划线。
            picName = picName.replace(' ', '_')
            pic.name = addName + picName
            productpicobj = ProductPic()
            productpicobj.ClassOne = classoneobj
            productpicobj.ClassTwo = classtwoobj
            productpicobj.Product = productobj
            productpicobj.Sequence = len(ProductPic.objects.filter(ClassOne = classoneobj, ClassTwo = classtwoobj, Product = productobj))
            productpicobj.Picture = pic
            productpicobj.ImageName = pic.name
            productpicobj.save()
            path = '/getPic/' + pic.name
            jsonObject = json.dumps({'picname':'path'},ensure_ascii = False)
            #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
            return HttpResponse(jsonObject,content_type="application/json")
        else:
            return HttpResponse('图片上传错误。或者系统出错，稍后再试。')
    elif manage == 'delete':
        classone = request.POST['classone']
        classtwo = request.POST['classtwo']
        productname = request.POST['productname']
        picnamels = request.POST['picname']
        classoneobj = ClassOne.objects.get(ClassName = classone)
        classtwoobj = ClassTwo.objects.get(ClassName = classtwo, PreClass = classoneobj)
        productobj = Products.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, ProductName = productname)
        for picname in picnamels:
            productobj = ProductPic.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, Product = productobj, ImageName = picname)
            os.remove(os.path.join(settings.MEDIA_ROOT, productobj.Picture.name))
            productobj.delete()
        #重新调整顺序.
        productpicobjls = ProductPic.objects.filter(ClassOne = classoneobj, ClassTwo = classtwoobj, Product = productobj).order_by('Sequence')
        i = 0
        for productpicobj in productpicobjls:
            productpicobj.Sequence = i
            i += 1
            productpicobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'sort':
        classone = request.POST['classone']
        classtwo = request.POST['classtwo']
        productname = request.POST['productname']
        sequence = request.POST['sequence']
        classoneobj = ClassOne.objects.get(ClassName = classone)
        classtwoobj = ClassTwo.objects.get(ClassName = classtwo, PreClass = classoneobj)
        productobj = Products.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, ProductName = productname)
        sequencels = sequence.split('#')
        i = 0
        for picname in sequencels:
            productpicobj = Products.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, Product = productobj, ImageName = picname)
            productpicobj.Sequence = i
            i += 1
            productpicobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。') 
















