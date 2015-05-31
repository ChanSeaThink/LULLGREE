# -*- coding: utf8 -*-
from django.shortcuts import render, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from back.models import *
import Image, ImageDraw, ImageFont, ImageFilter, random#PIL插件的文件
import time, os, re
from hashlib import sha1
from datetime import datetime, date
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
def managePassword(request):
    userID = request.session.get('userid', '')
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    manage = request.POST['manage']
    if manage == 'get':
        userobj = User.objects.get(id = userID)
        jsonObject = json.dumps({'username':userobj.UserName},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'change':
        oldpassword = request.POST['oldpassword']
        newpassword = request.POST['newpassword']
        userobj = User.objects.get(id = userID)
        shpw = sha1()
        shpw.update(oldpassword + str(userobj.Time)[0:19])
        spw = shpw.hexdigest()
        if spw != userobj.PassWord:
            jsonObject = json.dumps({'password':'密码错误!'},ensure_ascii = False)
            #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
            return HttpResponse(jsonObject,content_type="application/json")
        else:
            shpw1 = sha1()
            shpw1.update(newpassword + str(userobj.Time)[0:19])
            spw1 = shpw1.hexdigest()
            userobj = User.objects.get(id = userID)
            userobj.PassWord = spw1
            userobj.save()
            jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
            #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
            return HttpResponse(jsonObject,content_type="application/json")
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。')

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
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。')

def getClassTwo(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    classone = request.POST['classone']
    classoneobj = ClassOne.objects.get(ClassName = classone)
    classtwols = []
    classtwoobjls = ClassTwo.objects.filter(PreClass = classoneobj).order_by('Sequence')
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
        classtwoobj.ClassName = classname
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
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
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
        productpicls.append('/getPic/' + productpicobj.ImageName)
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
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。') 

def manageProductPic(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    manage = request.POST['manage']
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
            jsonObject = json.dumps({'picname':path},ensure_ascii = False)
            #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
            return HttpResponse(jsonObject,content_type="application/json")
        else:
            return HttpResponse('图片上传错误。或者系统出错，稍后再试。')
    elif manage == 'delete':
        print request.POST
        classone = request.POST['classone']
        classtwo = request.POST['classtwo']
        productname = request.POST['productname']
        picnamels = request.POST.getlist('picname[]')
        print picnamels
        classoneobj = ClassOne.objects.get(ClassName = classone)
        classtwoobj = ClassTwo.objects.get(ClassName = classtwo, PreClass = classoneobj)
        productobj = Products.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, ProductName = productname)
        for picname in picnamels:
            productpicobj = ProductPic.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, Product = productobj, ImageName = picname)
            os.remove(os.path.join(settings.MEDIA_ROOT, productpicobj.Picture.name))
            productpicobj.delete()
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
            print picname
            productpicobj = ProductPic.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, Product = productobj, ImageName = picname)
            productpicobj.Sequence = i
            productpicobj.save()
            i += 1
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。') 

def manageProductInfo(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')
    #此响应函数管理的是产品的属性表格。命名跟接口有些区别。请注意不要混乱。
    print request.POST
    classone = request.POST['classone']
    classtwo = request.POST['classtwo']
    productname = request.POST['productname']
    content = request.POST['content']
    classoneobj = ClassOne.objects.get(ClassName = classone)
    classtwoobj = ClassTwo.objects.get(PreClass = classoneobj, ClassName = classtwo)
    productobj = Products.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, ProductName = productname)
    productobj.ProductInfo = content
    productobj.save()
    jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def saveProductInfoPic(request):
    userPermission = request.session.get('permission', '')
    userID = request.session.get('userid', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')
    
    classone = request.POST['classone']
    classtwo = request.POST['classtwo']
    productname = request.POST['productname']
    pic = request.FILES['pic']
    t = int(time.time())
    rn = random.randrange(1,10000)
    addName = 'pip_' + str(t) + str(rn)#pip_用于区分图片
    picName = pic.name
    #以下代码替换掉文件名中的空格，改为下划线，有空格的文件名在存入mysql时会自动转化为下划线。
    picName = picName.replace(' ', '_')
    pic.name = addName + picName
    cacheproductinfopicobj = CacheProductInfoPic()
    cacheproductinfopicobj.Picture = pic
    cacheproductinfopicobj.UserID = User.objects.get(id = userID)
    cacheproductinfopicobj.ImageName = pic.name
    cacheproductinfopicobj.CreateTime = datetime.now()
    cacheproductinfopicobj.save()
    path = '/getPic/' + pic.name
    jsonObject = json.dumps({'picname':path},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def saveProductInfo(request):
    userPermission = request.session.get('permission', '')
    userID = request.session.get('userid', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')
    #此响应函数管理的是产品的详细介绍，即属性表下面的文章。命名跟接口有些区别。请注意不要混乱。
    classone = request.POST['classone']
    classtwo = request.POST['classtwo']
    productname = request.POST['productname']
    productinfo = request.POST['productinfo']
    userobj = User.objects.get(id = userID)
    classoneobj = ClassOne.objects.get(ClassName = classone)
    classtwoobj = ClassTwo.objects.get(PreClass = classoneobj, ClassName = classtwo)
    productobj = Products.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, ProductName = productname)
    #保存产品详细介绍。
    productobj.ProductInfoContent = productinfo
    productobj.save()
    #提取出详细产品介绍里面的所有图片的src的值
    picturesrcls = re.findall('<img src="(.*?)">',productinfo)
    picturenamels = []
    print picturesrcls
    for picturesrc in picturesrcls:
        if picturesrc[0:8]=='/getPic/':
            picturenamels.append(picturesrc[8:])
        else:
            continue
    #提取出已保存在数据表中的图片。
    productinfopicobjls = ProductInfoPic.objects.filter(ClassOne = classoneobj, ClassTwo = classtwoobj, Product = productobj)
    productinfopicnamels = []
    for productinfopicobj in productinfopicobjls:
        productinfopicnamels.append(productinfopicobj.ImageName)
    #‘已保存图片’和‘新上传图片’做交集运算。‘已保存图片’不在此交集的就删除，‘新上传图片’在此交集的删除。
    nochangepicturenamels = []
    productinfopicnamedeletels = []#用于保存‘已保存列表’中需要删除的图片名。
    for productinfopicname in productinfopicnamels:
        if productinfopicname in picturenamels:
            nochangepicturenamels.append(productinfopicname)
        else:
            productinfopicnamedeletels.append(productinfopicname)
    #‘新上传图片’在此交集的删除
    for nochangepicturename in nochangepicturenamels:
        if nochangepicturename in picturenamels:
            picturenamels.remove(nochangepicturename)
        else:
            continue
    #‘已保存图片’不在此交集的就删除
    for productinfopicname in productinfopicnamedeletels:
        productinfopicobj = ProductInfoPic.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, Product = productobj, ImageName = productinfopicname)
        os.remove(os.path.join(settings.MEDIA_ROOT, productinfopicobj.Picture.name))
        productinfopicobj.delete()
    #把新图片从缓存移到储存表中
    for picturename in picturenamels:
        cacheproductinfopicobj = CacheProductInfoPic.objects.get(UserID = userobj, ImageName = picturename)
        productinfopicobj = ProductInfoPic()
        productinfopicobj.ClassOne = classoneobj
        productinfopicobj.ClassTwo = classtwoobj
        productinfopicobj.Product = productobj
        productinfopicobj.Picture = cacheproductinfopicobj.Picture
        productinfopicobj.ImageName = picturename
        productinfopicobj.save()
        cacheproductinfopicobj.delete()
    #清除缓存表中该用户ID下的缓存。
    cacheproductinfopicobjls = CacheProductInfoPic.objects.filter(UserID = userobj)
    for cacheproductinfopicobj in cacheproductinfopicobjls:
        os.remove(os.path.join(settings.MEDIA_ROOT, cacheproductinfopicobj.Picture.name))
        cacheproductinfopicobj.delete()
    jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def manageBestProducts(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    manage = request.POST['manage']
    if manage == 'get':
        classone = request.POST['classone']
        classoneobj = ClassOne.objects.get(ClassName = classone)
        bestproductobjls = BestProduct.objects.filter(ClassOne = classoneobj)
        products = []
        classtwo = []
        for bestproductobj in bestproductobjls:
            classtwo.append(bestproductobj.ClassTwo.ClassName)
            products.append(bestproductobj.ClassTwo.ClassName + '#' + bestproductobj.ProductName)
        jsonObject = json.dumps({'products':products, 'classtwo':classtwo},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'add':
        classone = request.POST['classone']
        classtwo = request.POST['classtwo']
        productname = request.POST['productname']
        classoneobj = ClassOne.objects.get(ClassName = classone)
        classtwoobj = ClassTwo.objects.get(PreClass = classoneobj, ClassName = classtwo)
        productobj = Products.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, ProductName = productname)
        bestproductobj = BestProduct()
        bestproductobj.Product = productobj
        bestproductobj.ClassOne = classoneobj
        bestproductobj.ClassTwo = classtwoobj
        bestproductobj.ProductName = productname
        bestproductobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'delete':
        classone = request.POST['classone']
        classtwo = request.POST['classtwo']
        productname = request.POST['productname']
        classoneobj = ClassOne.objects.get(ClassName = classone)
        classtwoobj = ClassTwo.objects.get(PreClass = classoneobj, ClassName = classtwo)
        productobj = Products.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, ProductName = productname)
        bestproductobj = BestProduct.objects.get(ClassOne = classoneobj, ClassTwo = classtwoobj, Product = productobj, ProductName = productname)
        bestproductobj.delete()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。') 

#+----------+=====================================================================
#|新闻处理模块|=====================================================================
#+----------+=====================================================================
def saveNewsPic(request):
    userPermission = request.session.get('permission', '')
    userID = request.session.get('userid', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    pic = request.FILES['pic']
    t = int(time.time())
    rn = random.randrange(1,10000)
    addName = 'np_' + str(t) + str(rn)#pip_用于区分图片
    picName = pic.name
    #以下代码替换掉文件名中的空格，改为下划线，有空格的文件名在存入mysql时会自动转化为下划线。
    picName = picName.replace(' ', '_')
    pic.name = addName + picName
    userobj = User.objects.get(id = userID)
    cachenewspicobj = CacheNewsPic()
    cachenewspicobj.ImageName = pic.name
    cachenewspicobj.UserID = userobj
    cachenewspicobj.Picture = pic
    cachenewspicobj.save()
    path = '/getPic/' + pic.name
    jsonObject = json.dumps({'picname':path},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def manageNews(request):
    userPermission = request.session.get('permission', '')
    userID = request.session.get('userid', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    manage = request.POST['manage']
    if manage == 'get':
        newsobjls = News.objects.all()
        news = []
        for newsobj in newsobjls:
            news.append(newsobj.Title + '#' + newsobj.CreateDate)
        jsonObject = json.dumps({'newscount':len(newsobjls), 'news':news},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'delete':
        newstitle = request.POST('newstitle')
        time = request.POST('time')
        newsobj = News.objects.get(Title = newstitle)
        NewsPic.objects.filter(News = newsobj).delete()
        newsobj.delete()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'edit':
        newstitle = request.POST('newstitle')
        time = request.POST('time')
        newsobj = News.objects.get(Title = newstitle)
        jsonObject = json.dumps({'newstitle':newsobj.Title, 'content':newsobj.LongContent, 'id':newsobj.id},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'update':
        newstitle = request.POST['newstitle']
        content = request.POST['content']
        newsid = request.POST['id']
        contentnohtml = re.sub('<[^>]*?>','',content)
        if len(contentnohtml) < 40:
            shortcontent = contentnohtml + '......'
        else:
            shortcontent = contentnohtml[0:40] + '......'
        newsobj = News.objects.get(id = int(newsid))
        userobj = User.objects.get(id = userID)
        newsobj.Title = newstitle
        newsobj.ShortContent = shortcontent
        newsobj.LongContent = content
        newsobj.save()
        #提取出新闻里面的所有图片的src的值
        picturesrcls = re.findall('<img src="(.*?)">',content)
        picturenamels = []
        for picturesrc in picturesrcls:
            if picturesrc[0:8]=='/getPic/':
                picturenamels.append(picturesrc[8:])
            else:
                continue
        #提取出已保存在数据表中的图片。
        newspicobjls = NewsPic.objects.filter(News = newsobj)
        newspicnamels = []
        for newspicobj in newspicobjls:
            newspicnamels.append(newspicobj.ImageName)
        #‘已保存图片’和‘新上传图片’做交集运算。‘已保存图片’不在此交集的就删除，‘新上传图片’在此交集的删除。
        nochangepicturenamels = []
        newspicnamedeletels = []#用于保存‘已保存图片’中需要删除的图片名。
        for newspicname in newspicnamels:
            if newspicname in picturenamels:
                nochangepicturenamels.append(newspicname)
            else:
                newspicnamedeletels.append(newspicname)
        #‘新上传图片’在此交集的删除
        for nochangepicturename in nochangepicturenamels:
            if nochangepicturename in picturenamels:
                picturenamels.remove(nochangepicturename)
            else:
                continue
        #‘已保存图片’不在此交集的就删除
        for newspicname in newspicnamedeletels:
            newspicobj = NewsPic.objects.get(ImageName = newspicname)
            os.remove(os.path.join(settings.MEDIA_ROOT, newspicobj.Picture.name))
            newspicobj.delete()
        #把新图片从缓存移到储存表中
        for picturename in picturenamels:
            cachenewspicobj = CacheNewsPic.objects.get(ImageName = picturename)
            newspicobj = NewsPic()
            newspicobj.News = newsobj
            newspicobj.Picture = newspicobj.Picture
            newspicobj.ImageName = picturename
            newspicobj.save()
            cachenewspicobj.delete()
        #清除缓存表中该用户ID下的缓存。
        cachenewspicobjls = CacheNewsPic.objects.filter(UserID = userobj)
        for cachenewspicobj in cachenewspicobjls:
            os.remove(os.path.join(settings.MEDIA_ROOT, cachenewspicobj.Picture.name))
            cachenewspicobj.delete()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'add':
        newstitle = request.POST['newstitle']
        content = request.POST['content']
        contentnohtml = re.sub('<[^>]*?>','',content)
        if len(contentnohtml) < 40:
            shortcontent = contentnohtml + '......'
        else:
            shortcontent = contentnohtml[0:40] + '......'
        newsobj = News()
        userobj = User.objects.get(id = userID)
        newsobj.Title = newstitle
        newsobj.ShortContent = shortcontent
        newsobj.LongContent = content
        newsobj.CreateTime = datetime.now()
        newsobj.CreateDate = date.today()
        newsobj.save()
        #提取出新闻里面的所有图片的src的值
        picturesrcls = re.findall('<img src="(.*?)">',content)
        picturenamels = []
        for picturesrc in picturesrcls:
            if picturesrc[0:8]=='/getPic/':
                picturenamels.append(picturesrc[8:])
            else:
                continue
        #提取出已保存在数据表中的图片。
        newspicobjls = NewsPic.objects.filter(News = newsobj)
        newspicnamels = []
        for newspicobj in newspicobjls:
            newspicnamels.append(newspicobj.ImageName)
        #‘已保存图片’和‘新上传图片’做交集运算。‘已保存图片’不在此交集的就删除，‘新上传图片’在此交集的删除。
        nochangepicturenamels = []
        newspicnamedeletels = []#用于保存‘已保存图片’中需要删除的图片名。
        for newspicname in newspicnamels:
            if newspicname in picturenamels:
                nochangepicturenamels.append(newspicname)
            else:
                newspicnamedeletels.append(newspicname)
        #‘新上传图片’在此交集的删除
        for nochangepicturename in nochangepicturenamels:
            if nochangepicturename in picturenamels:
                picturenamels.remove(nochangepicturename)
            else:
                continue
        #‘已保存图片’不在此交集的就删除
        for newspicname in newspicnamedeletels:
            newspicobj = NewsPic.objects.get(ImageName = newspicname)
            os.remove(os.path.join(settings.MEDIA_ROOT, newspicobj.Picture.name))
            newspicobj.delete()
        #把新图片从缓存移到储存表中
        for picturename in picturenamels:
            cachenewspicobj = CacheNewsPic.objects.get(ImageName = picturename)
            newspicobj = NewsPic()
            newspicobj.News = newsobj
            newspicobj.Picture = cachenewspicobj.Picture
            newspicobj.ImageName = picturename
            newspicobj.save()
            cachenewspicobj.delete()
        #清除缓存表中该用户ID下的缓存。
        cachenewspicobjls = CacheNewsPic.objects.filter(UserID = userobj)
        for cachenewspicobj in cachenewspicobjls:
            os.remove(os.path.join(settings.MEDIA_ROOT, cachenewspicobj.Picture.name))
            cachenewspicobj.delete()
        #重新发送新闻的所有数据到终端。
        newsobjls = News.objects.all()
        news = []
        for newsobj in newsobjls:
            news.append(newsobj.Title + '#' + newsobj.CreateDate)
        jsonObject = json.dumps({'newscount':len(newsobjls), 'news':news},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。') 

#+----------+=====================================================================
#|招聘处理模块|=====================================================================
#+----------+=====================================================================
def manageJob(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    manage = request.POST['manage']
    if manage == 'class':
        jobobjls = Job.objects.all()
        jobclass = []
        for jobobj in jobobjls:
            jobclass.append(jobobj.Title)
        jsonObject = json.dumps({'class':jobclass},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'addclass':
        name = request.POST['name']
        jobobj = Job()
        jobobj.Title = name
        jobobj.Content = ''
        jobobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'deleteclass':
        name = request.POST['name']
        jobobj = Job.objects.get(Title = name)
        jobobj.delete()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'editclass':
        oldname = request.POST['oldname']
        newname = request.POST['newname']
        jobobj = Job.objects.get(Title = oldname)
        jobobj.Title = newname
        jobobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'get':
        name = request.POST['name']
        jobobj = Job.objects.get(Title = name)
        info = jobobj.Content
        jsonObject = json.dumps({'info':info},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'edit':
        name = request.POST['name']
        content = request.POST['content']
        jobobj = Job.objects.get(Title = name)
        jobobj.Content = content
        jobobj.save()
        jsonObject = json.dumps({'info':content},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。') 

#+--------------+=====================================================================
#|企业文化处理模块|=====================================================================
#+--------------+=====================================================================
def manageCompanyCulture(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    part = request.POST['part']
    manage = request.POST['']
    if part == 'companyinfo' and manage == 'get':
        cultureobj = Culture.objects.get(Part = part)
        content = cultureobj.Content
        jsonObject = json.dumps({'content':content},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif part == 'companyinfo' and manage == 'edit':
        content = request.POST['content']
        cultureobj = Culture.objects.get(Part = part)
        cultureobj.Content = content
        cultureobj.save()
        jsonObject = json.dumps({'content':content},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif part == 'greemind' and manage == 'get':
        cultureobj = Culture.objects.get(Part = part)
        content = cultureobj.Content
        jsonObject = json.dumps({'content':content},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif part == 'greemind' and manage == 'edit':
        content = request.POST['content']
        cultureobj = Culture.objects.get(Part = part)
        cultureobj.Content = content
        cultureobj.save()
        jsonObject = json.dumps({'content':content},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif part == 'leaderword' and manage == 'get':
        cultureobj = Culture.objects.get(Part = part)
        content = cultureobj.Content
        jsonObject = json.dumps({'content':content},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif part == 'leaderword' and manage == 'edit':
        content = request.POST['content']
        cultureobj = Culture.objects.get(Part = part)
        cultureobj.Content = content
        cultureobj.save()
        jsonObject = json.dumps({'content':content},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif part == 'companyCompanyCulture' and manage == 'get':
        honorpicobjls = HonorPic.objects.all()
        honorpic = []
        for honorpicobj in honorpicobjls:
            honorpin.append('/getPic/' + honorpicobj.ImageName)
        jsonObject = json.dumps({'honorpic':honorpic},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif part == 'companyCompanyCulture' and manage == 'add':
        pic = request.FILES['pic']
        t = int(time.time())
        rn = random.randrange(1,10000)
        addName = 'hp_' + str(t) + str(rn)#hp_用于区分图片
        picName = pic.name
        #以下代码替换掉文件名中的空格，改为下划线，有空格的文件名在存入mysql时会自动转化为下划线。
        picName = picName.replace(' ', '_')
        pic.name = addName + picName
        honorpicobj = HonorPic()
        honorpicobj.Picture = pic
        honorpicobj.ImageName = pic.name
        honorpicobj.save()
        path = '/getPic/' + pic.name
        jsonObject = json.dumps({'picname':path},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif part == 'companyCompanyCulture' and manage == 'delete':
        picnamels = request.POST['pic']
        for picname in picnamels:
            honorpicobj = HonorPic.objects.get(ImageName = picname)
            honorpicobj.delete()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。') 

#+--------------+=====================================================================
#|联系我们处理模块|=====================================================================
#+--------------+=====================================================================
def manageContactUs(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    manage = request.POST('manage')
    if manage == 'get':
        contactusobj = ContactUs.objects.all()[0]
        jsonObject = json.dumps({'content':contactusobj.Content},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'edit':
        content = request.POST['content']
        contactusobj = ContactUs.objects.all()[0]
        contactusobj.Content = content
        contactusobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。') 

#+--------------+=====================================================================
#|工程案例处理模块|=====================================================================
#+--------------+=====================================================================
def manageCase(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    manage = request.POST('manage')
    if manage == 'get':
        casename = request.POST.get('casename','')
        if casename == '':
            caseobjls = Case.objects.all().order_by('Sequence')
            case = []
            for caseobj in caseobjls:
                case.append(caseobj.Title)
            jsonObject = json.dumps({'case':case},ensure_ascii = False)
            #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
            return HttpResponse(jsonObject,content_type="application/json")
        else:
            caseobj = Case.objects.get(Title = casename)
            casefirstpicobj = CaseFirstPic.objects.get(Case = caseobj)
            path = '/getPic/' + casefirstpicobj.ImageName
            jsonObject = json.dumps({'pic':path, 'casename':caseobj.Title, 'content':caseobj.Content},ensure_ascii = False)
            #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
            return HttpResponse(jsonObject,content_type="application/json")
    elif manage =='add':
        casename = request.POST['casename']
        caseobj = Case()
        caseobj.Title = casename
        caseobj.Content = ''
        caseobj.Sequence = len(Case.objects.all())
        caseobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage =='delete':
        casename = request.POST['casename']
        caseobj = Case.objects.get(Title = casename)
        CaseFirstPic.objects.filter(Case = caseobj).delete()
        CasePic.objects.filter(Case = caseobj).delete()
        caseobj.delete()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage =='edit':
        oldname = request.POST['oldname']
        casename = request.POST['casename']
        caseobj = Case.objects.get(Title = oldname)
        caseobj.Title = casename
        caseobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage =='sort':
        sequence = request.POST['Sequence']
        sequencels = sequence.split('#')
        i = 0
        for casename in sequencels:
            caseobj = Case.objects.get(Title = casename)
            caseobj.Sequence = i
            i += 1
            caseobj.svae()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。') 

def saveCaseFirstPic(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    casename = request.POST['casename']
    pic = request.FILES['pic']
    t = int(time.time())
    rn = random.randrange(1,10000)
    addName = 'cfp_' + str(t) + str(rn)#cfp_用于区分图片
    picName = pic.name
    #以下代码替换掉文件名中的空格，改为下划线，有空格的文件名在存入mysql时会自动转化为下划线。
    picName = picName.replace(' ', '_')
    pic.name = addName + picName
    caseobj = Case.objects.get(Title = casename)
    casefirstpicobj = CaseFirstPic()
    casefirstpicobj.Case = caseobj
    casefirstpicobj.ImageName = pic.name
    casefirstpicobj.Picture = pic
    casefirstpicobj.save()
    path = '/getPic/' + pic.name
    jsonObject = json.dumps({'picname':path},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def saveCasePic(request):
    userPermission = request.session.get('permission', '')
    userID = request.session.get('userid', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    casename = request.POST['casename']
    pic = request.FILES['pic']
    t = int(time.time())
    rn = random.randrange(1,10000)
    addName = 'cp_' + str(t) + str(rn)#cp_用于区分图片
    picName = pic.name
    #以下代码替换掉文件名中的空格，改为下划线，有空格的文件名在存入mysql时会自动转化为下划线。
    picName = picName.replace(' ', '_')
    pic.name = addName + picName
    userobj = User.objects.get(id = userID)
    cachecasepicobj = CacheCasePic()
    cachecasepicobj.ImageName = pic.name
    cachecasepicobj.UserID
    cachecasepicobj.Picture = pic
    cachecasepicobj.save()
    path = '/getPic/' + pic.name
    jsonObject = json.dumps({'picname':path},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def saveCaseInfo(request):
    userPermission = request.session.get('permission', '')
    userID = request.session.get('userid', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')   
    
    casename = request.POST['casename']
    content = request.POST['content']
    caseobj = Case.objects.get(Title = casename)
    caseobj.content = content
    caseobj.save()
    userobj = User.objects.get(id = userID)
    #提取出新闻里面的所有图片的src的值
    picturesrcls = re.findall('<img src="(.*?)">',content)
    picturenamels = []
    for picturesrc in picturesrcls:
        if picturesrc[0:8]=='/getPic/':
            picturenamels.append(picturesrc[8:])
        else:
            continue
    #提取出已保存在数据表中的图片。
    casepicobjls = CasePic.objects.filter(Case = caseobj)
    casepicnamels = []
    for casepicobj in casepicobjls:
        casepicnamels.append(casepicobj.ImageName)
    #‘已保存图片’和‘新上传图片’做交集运算。‘已保存图片’不在此交集的就删除，‘新上传图片’在此交集的删除。
    nochangepicturenamels = []#此变量表示交集
    casepicnamedeletels = []#用于保存‘已保存图片’中需要删除的图片名。
    for casepicname in casepicnamels:
        if newspicname in picturenamels:
            nochangepicturenamels.append(newspicname)
        else:
            casepicnamedeletels.append(newspicname)
    #‘新上传图片’在此交集的删除
    for nochangepicturename in nochangepicturenamels:
        if nochangepicturename in picturenamels:
            picturenamels.remove(nochangepicturename)
        else:
            continue
    #‘已保存图片’不在此交集的就删除
    for casepicname in casepicnamedeletels:
        casepicobj = CasePic.objects.get(ImageName = casepicname)
        os.remove(os.path.join(settings.MEDIA_ROOT, casepicobj.Picture.name))
        casepicobj.delete()
    #把新图片从缓存移到储存表中
    for picturename in picturenamels:
        cachecasepicobj = CacheCasePic.objects.get(ImageName = picturename)
        casepicobj = NewsPic()
        casepicobj.News = newsobj
        casepicobj.Picture = cachecasepicobj.Picture
        casepicobj.ImageName = picturename
        casepicobj.save()
        cachecasepicobj.delete()
    #清除缓存表中该用户ID下的缓存。
    cachecasepicobjls = CacheCasePic.objects.filter(UserID = userobj)
    for cachecasepicobj in cachecasepicobjls:
        os.remove(os.path.join(settings.MEDIA_ROOT, cachecasepicobj.Picture.name))
        cachecasepicobj.delete()
    jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

#+--------------+=====================================================================
#|店铺展示处理模块|=====================================================================
#+--------------+=====================================================================
def manageShop(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    manage = request.POST('manage')
    if manage == 'get':
        shopname = request.POST.get('shopname','')
        if shopname == '':
            shopobjls = Shop.objects.all().order_by('Sequence')
            shop = []
            for shopobj in shopobjls:
                shop.append(shopobj.Title)
            jsonObject = json.dumps({'shop':shop},ensure_ascii = False)
            #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
            return HttpResponse(jsonObject,content_type="application/json")
        else:
            shopobj = Shop.objects.get(Title = shopname)
            shopfirstpicobj = ShopFirstPic.objects.get(Shop = shopobj)
            path = '/getPic/' + shopfirstpicobj.ImageName
            jsonObject = json.dumps({'pic':path, 'shopname':shopobj.Title, 'content':shopobj.Content},ensure_ascii = False)
            #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
            return HttpResponse(jsonObject,content_type="application/json")
    elif manage =='add':
        shopname = request.POST['shopname']
        shopobj = Shop()
        shopobj.Title = shopname
        shopobj.Content = ''
        shopobj.Sequence = len(Shop.objects.all())
        shopobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage =='delete':
        shopname = request.POST['shopname']
        shopobj = Shop.objects.get(Title = shopname)
        ShopFirstPic.objects.filter(Shop = shopobj).delete()
        ShopPic.objects.filter(Shop = shopobj).delete()
        shopobj.delete()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage =='edit':
        oldname = request.POST['oldname']
        shopname = request.POST['shopname']
        shopobj = Shop.objects.get(Title = oldname)
        shopobj.Title = shopname
        shopobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage =='sort':
        sequence = request.POST['Sequence']
        sequencels = sequence.split('#')
        i = 0
        for shopname in sequencels:
            shopobj = Shop.objects.get(Title = shopname)
            shopobj.Sequence = i
            i += 1
            shopobj.svae()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。') 

def saveShopFirstPic(request):
    userPermission = request.session.get('permission', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    shopname = request.POST['shopname']
    pic = request.FILES['pic']
    t = int(time.time())
    rn = random.randrange(1,10000)
    addName = 'sfp_' + str(t) + str(rn)#cfp_用于区分图片
    picName = pic.name
    #以下代码替换掉文件名中的空格，改为下划线，有空格的文件名在存入mysql时会自动转化为下划线。
    picName = picName.replace(' ', '_')
    pic.name = addName + picName
    shopobj = Shop.objects.get(Title = shopname)
    shopfirstpicobj = ShopFirstPic()
    shopfirstpicobj.Shop = shopobj
    shopfirstpicobj.ImageName = pic.name
    shopfirstpicobj.Picture = pic
    shopfirstpicobj.save()
    path = '/getPic/' + pic.name
    jsonObject = json.dumps({'picname':path},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def saveShopPic(request):
    userPermission = request.session.get('permission', '')
    userID = request.session.get('userid', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')

    shopname = request.POST['shopname']
    pic = request.FILES['pic']
    t = int(time.time())
    rn = random.randrange(1,10000)
    addName = 'sp_' + str(t) + str(rn)#cp_用于区分图片
    picName = pic.name
    #以下代码替换掉文件名中的空格，改为下划线，有空格的文件名在存入mysql时会自动转化为下划线。
    picName = picName.replace(' ', '_')
    pic.name = addName + picName
    userobj = User.objects.get(id = userID)
    cacheshoppicobj = CacheShopPic()
    cacheshoppicobj.ImageName = pic.name
    cacheshoppicobj.UserID
    cacheshoppicobj.Picture = pic
    cacheshoppicobj.save()
    path = '/getPic/' + pic.name
    jsonObject = json.dumps({'picname':path},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def saveShopInfo(request):
    userPermission = request.session.get('permission', '')
    userID = request.session.get('userid', '')
    if userPermission < 1:
        return HttpResponse('Without Permission')   
    
    shopname = request.POST['shopname']
    content = request.POST['content']
    shopobj = Shop.objects.get(Title = shopname)
    shopobj.content = content
    shopobj.save()
    userobj = User.objects.get(id = userID)
    #提取出新闻里面的所有图片的src的值
    picturesrcls = re.findall('<img src="(.*?)">',content)
    picturenamels = []
    for picturesrc in picturesrcls:
        if picturesrc[0:8]=='/getPic/':
            picturenamels.append(picturesrc[8:])
        else:
            continue
    #提取出已保存在数据表中的图片。
    shoppicobjls = ShopPic.objects.filter(Shop = shopobj)
    shoppicnamels = []
    for shoppicobj in shoppicobjls:
        shoppicnamels.append(shoppicobj.ImageName)
    #‘已保存图片’和‘新上传图片’做交集运算。‘已保存图片’不在此交集的就删除，‘新上传图片’在此交集的删除。
    nochangepicturenamels = []#此变量表示交集
    shoppicnamedeletels = []#用于保存‘已保存图片’中需要删除的图片名。
    for shoppicname in shoppicnamels:
        if newspicname in picturenamels:
            nochangepicturenamels.append(newspicname)
        else:
            shoppicnamedeletels.append(newspicname)
    #‘新上传图片’在此交集的删除
    for nochangepicturename in nochangepicturenamels:
        if nochangepicturename in picturenamels:
            picturenamels.remove(nochangepicturename)
        else:
            continue
    #‘已保存图片’不在此交集的就删除
    for shoppicname in shoppicnamedeletels:
        shoppicobj = ShopPic.objects.get(ImageName = shoppicname)
        os.remove(os.path.join(settings.MEDIA_ROOT, shoppicobj.Picture.name))
        shoppicobj.delete()
    #把新图片从缓存移到储存表中
    for picturename in picturenamels:
        cacheshoppicobj = CacheShopPic.objects.get(ImageName = picturename)
        shoppicobj = NewsPic()
        shoppicobj.News = newsobj
        shoppicobj.Picture = cacheshoppicobj.Picture
        shoppicobj.ImageName = picturename
        shoppicobj.save()
        cacheshoppicobj.delete()
    #清除缓存表中该用户ID下的缓存。
    cacheshoppicobjls = CacheShopPic.objects.filter(UserID = userobj)
    for cacheshoppicobj in cacheshoppicobjls:
        os.remove(os.path.join(settings.MEDIA_ROOT, cacheshoppicobj.Picture.name))
        cacheshoppicobj.delete()
    jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

#+--------------+=====================================================================
#|初始化网站的配置|=====================================================================
#+--------------+=====================================================================
def initialise(request):
    userPermission = request.session.get('permission', '')
    userID = request.session.get('userid', '')
    if userPermission < 2:
        return HttpResponse('Without Permission')

    if len(ContactUs.objects.all()) == 0:
        contactusobj = ContactUs()
        contactusobj.Content = ''
        contactusobj.save() 

    if len(Culture.objects.all()) == 0:
        cultureobj1 = Culture()
        cultureobj1.Part = 'companyinfo'
        cultureobj1.Content = ''
        cultureobj1.save()
        cultureobj2 = Culture()
        cultureobj2.Part = 'greemind'
        cultureobj2.Content = ''
        cultureobj2.save()
        cultureobj3 = Culture()
        cultureobj3.Part = 'leaderword'
        cultureobj3.Content = ''
        cultureobj3.save()
    return HttpResponse('数据库初始化成功～')

#+--------------+=====================================================================
#|显示图片！！！！|=====================================================================
#+--------------+=====================================================================
def getPic(request, ImgName):
    item = ImgName.split('_')[0]
    if item == 'pp':#ProductPic
        productpicobj = ProductPic.objects.get(ImageName = ImgName)
        return HttpResponse(productpicobj.Picture, 'image')
    elif item == 'pip':#ProductInfoPic
        productinfopicobjls = ProductInfoPic.objects.filter(ImageName = ImgName)
        if len(productinfopicobjls) == 1:
            return HttpResponse(productinfopicobjls[0].Picture, 'image')
        else:
            cacheproductinfopicobj = CacheProductInfoPic.objects.get(ImageName = ImgName)
            return HttpResponse(cacheproductinfopicobj.Picture, 'image')
    elif item == 'np':#NewsPic
        newspicobjls = NewsPic.objects.filter(ImageName = ImgName)
        if len(newspicobjls) == 1:
            return HttpResponse(newspicobjls[0].Picture, 'image')
        else:
            cachenewspicobj = CacheNewsPic.objects.get(ImageName = ImgName)
            return HttpResponse(cachenewspicobj.Picture, 'image')
    elif item == 'hp':#HonorPic
        honorpicobj = HonorPic.objects.get(ImageName = ImageName)
        return HttpResponse(honorpicobj.Picture, 'image')
    elif item == 'cfp':#CaseFirstPic
        casefirstpicobj = CaseFirstPic.objects.get(ImageName = ImgName)
        return HttpResponse(casefirstpicobj.Picture, 'image')
    elif item == 'cp':#CasePic
        casepicobjls = CasePic.objects.filter(ImageName = ImgName)
        if len(casepicobjls) == 1:
            return HttpResponse(casepicobjls[0].Picture, 'image')
        else:
            cachecasepicobj = CacheCasePic.objects.get(ImageName = ImgName)
            return HttpResponse(cachecasepicobj.Picture, 'image')
    elif item == 'sfp':#ShopFirstPic
        shopfirstpicobj = ShopFirstPic.objects.get(ImageName = ImgName)
        return HttpResponse(shopfirstpicobj.Picture, 'image')
    elif item == 'sp':#ShopPic
        shoppicobjls = ShopPic.objects.filter(ImageName = ImgName)
        if len(shoppicobjls) == 1:
            return HttpResponse(shoppicobjls[0].Picture, 'image')
        else:
            cacheshoppicobj = CacheShopPic.objects.get(ImageName = ImgName)
            return HttpResponse(cacheshoppicobj.Picture, 'image')
    else:
        return HttpResponse('errer')



