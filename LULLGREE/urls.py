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
    url(r'^manageAccount$', 'back.views.manageAccount'),
    url(r'^getClassOne$', 'back.views.getClassOne'),
    url(r'^manageClassOne$', 'back.views.manageClassOne'),
    url(r'^getClassTwo$', 'back.views.getClassTwo'),
)
