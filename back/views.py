# -*- coding: utf8 -*-
from django.shortcuts import render, render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from back.models import User
import Image, ImageDraw, ImageFont, ImageFilter, random#PIL插件的文件
from hashlib import sha1
from datetime import datetime
import cStringIO#用于把生成的图片写入内存
import platform#用于判断操作系统
import json
# Create your views here.
def l3admin(requerst):
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

#后台登录注册页和后台管理的分割线-----------------------------------------------------------------------------

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



