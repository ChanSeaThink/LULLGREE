# -*- coding: utf8 -*-
from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'LULLGREE.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^l3admin$', 'back.views.l3admin'),
    url(r'^l3back$', 'back.views.l3back'),
    url(r'^regist$', 'back.views.regist'),
    url(r'^login$', 'back.views.login'),
    url(r'^logout$', 'back.views.logout'),
    url(r'^permission$', 'back.views.permission'),
    url(r'^getCAPTCHA', 'back.views.getCAPTCHA'),
    url(r'^getAccount$', 'back.views.getAccount'),
    url(r'^managePassword$', 'back.views.managePassword'),
    url(r'^manageAccount$', 'back.views.manageAccount'),
    url(r'^getClassOne$', 'back.views.getClassOne'),
    url(r'^manageClassOne$', 'back.views.manageClassOne'),
    url(r'^getClassTwo$', 'back.views.getClassTwo'),
    url(r'^getProduct$', 'back.views.getProduct'),
    url(r'^getProductInfo$', 'back.views.getProductInfo'),
    url(r'^manageProduct$', 'back.views.manageProduct'),
    url(r'^manageProductPic$', 'back.views.manageProductPic'),
    url(r'^manageProductInfo$', 'back.views.manageProductInfo'),#此处处理的是产品属性
    url(r'^saveProductInfoPic$', 'back.views.saveProductInfoPic'),
    url(r'^saveProductInfo$', 'back.views.saveProductInfo'),#此处处理的是产品详细介绍
    url(r'^manageBestProducts$', 'back.views.manageBestProducts'),
    url(r'^saveNewsPic$', 'back.views.saveNewsPic'),
    url(r'^manageNews$', 'back.views.manageNews'),
    url(r'^manageJob$', 'back.views.manageJob'),
    url(r'^manageCompanyCulture$', 'back.views.manageCompanyCulture'),
    url(r'^manageContactUs$', 'back.views.manageContactUs'),
    url(r'^manageCase$', 'back.views.manageCase'),
    url(r'^saveCaseFirstPic$', 'back.views.saveCaseFirstPic'),
    url(r'^saveCasePic$', 'back.views.saveCasePic'),
    url(r'^saveCaseInfo$', 'back.views.saveCaseInfo'),
    url(r'^manageShop$', 'back.views.manageShop'),
    url(r'^saveShopFirstPic$', 'back.views.saveShopFirstPic'),
    url(r'^saveShopPic$', 'back.views.saveShopPic'),
    url(r'^saveShopInfo$', 'back.views.saveShopInfo'),
    url(r'^initialise$', 'back.views.initialise'),#初始化几张特殊的表格。
    url(r'^getPic/(?P<ImgName>.*\.(jpg|png|gif|jpeg|ico)$)', 'back.views.getPic'),
    #以上都是后台的链接，以下是前台的链接。
)
