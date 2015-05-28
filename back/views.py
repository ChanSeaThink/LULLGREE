# -*- coding: utf8 -*-
from django.shortcuts import render, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from back.models import *
import Image, ImageDraw, ImageFont, ImageFilter, random#PIL插件的文件
from hashlib import sha1
from datetime import datetime
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
    classoneobjls = ClassOne.objects.all()
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
        classoneobj = Products.objects.get(ClassName = classname)
        BestProduct.objects.filter(ClassOne = classoneobj).delete()
        ProductInfoPic.objects.filter(ClassOne = classoneobj).delete()
        ProductPic.objects.filter(ClassOne = classoneobj).delete()
        Products.objects.filter(ClassOne = classoneobj).delete()
        ClassTwo.objects.filter(PreClass = classoneobj).delete()
        classoneobj.delete()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'edit':
        classname = request.POST['classname']
        oldname = request.POST['oldname']
        classoneobj = Products.objects.get(ClassName = oldname)
        classoneobj.ClassName = classname
        classoneobj.save()
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
    classtwoobjls = ClassTwo.objects.filter(ClassOne = classoneobj)
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
        classoneobj = ClassOne.objcets.get(ClassName = classone)
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
        classname = request.POST['classname']
        classoneobj = Products.objects.get(ClassName = classname)
        BestProduct.objects.filter(ClassOne = classoneobj).delete()
        ProductInfoPic.objects.filter(ClassOne = classoneobj).delete()
        ProductPic.objects.filter(ClassOne = classoneobj).delete()
        Products.objects.filter(ClassOne = classoneobj).delete()
        ClassTwo.objects.filter(PreClass = classoneobj).delete()
        classoneobj.delete()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    elif manage == 'edit':
        classname = request.POST['classname']
        oldname = request.POST['oldname']
        classoneobj = Products.objects.get(ClassName = oldname)
        classoneobj.ClassName = classname
        classoneobj.save()
        jsonObject = json.dumps({'status':'success'},ensure_ascii = False)
        #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
        return HttpResponse(jsonObject,content_type="application/json")
    else:
        return HttpResponse('操作有误！或者系统出错，稍后再试。') 