# -*- coding: utf8 -*-
from django.shortcuts import render_to_response
from back.models import *
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

        return render_to_response('gree_index.html', {'classonestr': classonestr, 'classonels':classonels, 'oneclassone':oneclassone,'productls':productls})

def product(requrst):
    return render_to_response('gree_products.html')

def news(requrst):
    return render_to_response('gree_news.html')

def shop(requrst):
    return render_to_response('gree_stores.html')

def case(requrst):
    return render_to_response('gree_engineering.html')

def job(requrst):
    return render_to_response('gree_recruitment.html')

def culture(requrst):
    return render_to_response('gree_culture.html')

def contact(requrst):
    return render_to_response('gree_contact.html')




