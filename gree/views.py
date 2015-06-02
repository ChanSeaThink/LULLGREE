# -*- coding: utf8 -*-
from django.shortcuts import render_to_response
from django.http import HttpResponse
from back.models import *
import json
# Create your views here.
def index(requrst):
    classoneobjls = ClassOne.objects.all().order_by('Sequence')
    if len(classoneobjls) == 0:
        return render_to_response('gree_index.html')
    elif len(classoneobjls) == 1:
        bestproductobjls = BestProduct.objects.all()
        productls = []
        if len(bestproductobjls) > 0:
            productname = bestproductobjls[0].ProductName
            productpicobjls = ProductPic.objects.filter(Product = bestproductobjls[0].Product) 
            path = '/getPic/' + productpicobjls[0].ImageName
            productls.append(dict(Title = productname, PicPath = path))
        return render_to_response('gree_index.html', {'classonestr': classoneobjls[0].ClassName, 'oneclassone':classoneobjls[0], 'productls':productls})
    else:
        length = len(classoneobjls)
        classonestrls = []
        classonestr = ''
        if length > 4:
            i = 4
            while i > 0:
                classonestrls.append(classoneobjls[4-i].ClassName)
                i -= 1
            classonestr = ','.join(classonestrls)
        else:
            for classoneobj in classoneobjls:
                classonestrls.append(classoneobj.ClassName)
            classonestr = ','.join(classonestrls)

        if length > 5:
            classonels = classoneobjls[0:4]
        else:
            classonels = classoneobjls[0:length - 1]

        if length > 5:
            oneclassone = classoneobjls[4]
        else:
            oneclassone = classoneobjls[length - 1]

        productls = []
        if length > 4:
            bestproductobjls = BestProduct.objects.all()[0:4]
            for bestproductobj in bestproductobjls:
                path = '/getPic/' +  ProductPic.objects.filter(Product = bestproductobj.Product)[0].ImageName
                productls.append(dict(Title = bestproductobj.ProductName, PicPath = path))
        else:
            bestproductobjls = BestProduct.objects.all()
            for bestproductobj in bestproductobjls:
                path = '/getPic/' +  ProductPic.objects.filter(Product = bestproductobj.Product)[0].ImageName
                productls.append(dict(Title = bestproductobj.ProductName, PicPath = path))

        return render_to_response('gree_index.html', {'classonestr': classonestr, 
                                                      'classonels':classonels, 
                                                      'oneclassone':oneclassone,
                                                      'productls':productls})

def product(requrst):
    return render_to_response('gree_products.html')

def news(requrst):
    newsobjls = News.objects.all()[0:10]
    newscount = len(News.objects.all())
    newsls = []
    for newsobj in newsobjls:
        date = str(newsobj.CreateDate)
        datels = date.split('-')
        D = datels[2]
        YM = datels[0] + ' ' + datels[1]
        newsls.append(dict(D = D, YM = YM, Title = newsobj.Title, ShortContent = newsobj.ShortContent))
    return render_to_response('gree_news.html', {'newscount':newscount, 'newsls':newsls})

def getNews(requrst):
    name = requrst.POST['Title']
    newsobj = News.objects.get(Title = name)
    jsonObject = json.dumps({'content':newsobj.LongContent},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def shop(requrst):
    shopobjls = Shop.objects.all().order_by('Sequence')
    shopls = []
    for shopobj in shopobjls:
        try:
            picname = ShopFirstPic.objects.get(Shop = shopobj).ImageName
        except ShopFirstPic.DoesNotExist:
            picname = ''
        shopls.append(dict(Title = shopobj.Title, path = '/getPic/' + picname))
    return render_to_response('gree_stores.html', {'shopls':shopls})

def getStore(requrst):
    name = requrst.POST['storename']
    shopobj = Shop.objects.get(Title = name)
    jsonObject = json.dumps({'content':shopobj.Content},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def case(requrst):
    caseobjls = Case.objects.all().order_by('Sequence')
    casels = []
    for caseobj in caseobjls:
        try:
            picname = CaseFirstPic.objects.get(Case = caseobj).ImageName
        except CaseFirstPic.DoesNotExist:
            picname = ''
        casels.append(dict(Title = caseobj.Title, path = '/getPic/' + picname))
    return render_to_response('gree_engineering.html', {'casels':casels})

def getEngineer(requrst):
    name = requrst.POST['engineername']
    caseobj = Case.objects.get(Title = name)
    jsonObject = json.dumps({'content':caseobj.Content},ensure_ascii = False)
    #加上ensure_ascii = False，就可以保持utf8的编码，不会被转成unicode
    return HttpResponse(jsonObject,content_type="application/json")

def job(requrst):
    jobobjls = Job.objects.all()
    return render_to_response('gree_recruitment.html', {'jobls':jobobjls})

def culture(requrst):
    honorpicobjls = HonorPic.objects.all()
    picpathls = []
    for honorpicobj in honorpicobjls:
        picpathls.append('/getPic/' + honorpicobj.ImageName)
    return render_to_response('gree_culture.html', {'companyinfo':Culture.objects.get(Part = 'companyinfo').Content,
                                                    'greemind':Culture.objects.get(Part = 'greemind').Content,
                                                    'leaderword':Culture.objects.get(Part = 'leaderword').Content,
                                                    'picpathls':picpathls})

def contact(requrst):
    contactusobj = ContactUs.objects.all()[0]
    return render_to_response('gree_contact.html', {'content':contactusobj.Content})




