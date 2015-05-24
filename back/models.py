# -*- coding: utf8 -*-
from django.db import models
# Create your models here.
class User(models.Model):
    '''
    后台用户信息表。

    UserName:用户名，用于登陆；
    PassWord:登陆密码，以hash值保存；
    Permission:用户权限，整数；
    Time:注册时间；
    '''
    UserName = models.CharField(max_length = 50)
    PassWord = models.CharField(max_length = 200)
    Permission = models.IntegerField(default = 0)
    Time = models.DateTimeField()

class ClassOne(models.Model):
    '''
    产品类别第一大类。

    ClassName:类名；
    SubClassNum:子类的数量；
    Sequence:显示的顺序；
    ProductCount:该类下的产品数量；
    '''
    ClassName = models.CharField(max_length = 50)
    SubClassNum = models.IntegerField()
    Sequence = models.IntegerField()
    ProductCount = models.IntegerField()

class ClassTwo(models.Model):
    '''
    产品类别的第二层分类。

    PreClass:父类；
    ClassName:类名；
    Sequence:显示顺序；
    ProductCount:该类下的产品数量；
    '''
    PreClass = models.ForeignKey('ClassOne')
    ClassName = models.CharField(max_length = 50)
    Sequence = models.IntegerField()
    ProductCount = models.IntegerField()

class Products(models.Model):
    '''
    产片信息表格。

    ClassOne：隶属的第一级别的类；
    ClassTwo：隶属的第二级别的类；
    ProductName：产品的名字；
    ProductInfo：产品的信息；
    Sequence：产品在该类下的排列顺序；
    '''
    ClassOne = models.ForeignKey('ClassOne')
    ClassTwo = models.ForeignKey('ClassTwo')
    ProductName = models.CharField(max_length = 50)
    ProductInfo = models.TextField()
    Sequence = models.IntegerField()

class ProductPic(models.Model):
    '''
    产品图片路径。

    Product:隶属产品；
    Sequence:图片顺序；
    Picture:图片路径；
    Thumbnail:压缩图片路径；
    '''
    Product = models.ForeignKey('Products')
    Sequence = models.IntegerField()
    Picture = models.ImageField(upload_to='product_picture')
    Thumbnail = models.ImageField(upload_to='product_thumbnail')

class News(models.Model):
    '''
    新闻。

    Title:标题；
    ShortContent:简介；
    LongContent:原文；
    CreateTime:创建时间；
    CreateDate:日期；
    '''
    Title = models.CharField(max_length = 200)
    ShortContent = models.CharField(max_length = 400)
    LongContent = models.TextField()
    CreateTime = models.DateTimeField()
    CreateDate = models.DateField()

    class Meta:
        ordering = ['-CreateTime']

class NewsPic(models.Model):
    '''
    新闻图片。

    News:新闻；
    Picture:新闻图片；
    '''
    News = models.ForeignKey('News')
    Picture = models.ImageField(upload_to='news_picture')

class Case(models.Model):
    '''
    项目展示。

    Title:项目标题；
    Content:项目组体；
    Sequence:项目展示顺序；
    '''
    Title = models.CharField(max_length = 200)
    Content = models.TextField()
    Sequence = models.IntegerField()

class CasePic(models.Model):
    '''
    项目图片。

    Case:项目。
    Picture:图片。
    Thumbnail:压缩图片。
    '''
    Case = models.ForeignKey('Case')
    Picture = models.ImageField(upload_to='case_picture')
    Thumbnail = models.ImageField(upload_to='case_thumbnail')

class Job(models.Model):
    '''
    招聘信息。

    Title:标题；
    Content:招聘详细信息；
    '''
    Title = models.CharField(max_length = 200)
    Content = models.TextField()

class Show(models.Model):
    '''
    店面展示。

    Title:店面标题；
    Content:店面展示主体；
    Sequence:店面展示顺序；
    '''
    Title = models.CharField(max_length = 200)
    Content = models.TextField()
    Sequence = models.IntegerField()

class ShowPic(models.Model):
    '''
    店面图片。

    Show:店面；
    Picture:图片；
    Thumbnail:压缩图片；
    '''
    Show = models.ForeignKey('Show')
    Picture = models.ImageField(upload_to='show_picture')
    Thumbnail = models.ImageField(upload_to='show_thumbnail')

