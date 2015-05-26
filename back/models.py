# -*- coding: utf8 -*-
from django.db import models
# Create your models here.

#用户信息表格=========================================================
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

#商品信息相关的表格=========================================================
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
    ProductInfoBody:产品主体；
    ProductInfoFeature:产品功能；
    ProductInfoSize:产品规格；
    ProductInfoContent:产品详细介绍；
    Sequence：产品在该类下的排列顺序；
    '''
    ClassOne = models.ForeignKey('ClassOne')
    ClassTwo = models.ForeignKey('ClassTwo')
    ProductName = models.CharField(max_length = 250)
    ProductInfoBody = models.TextField()
    ProductInfoFeature = models.TextField()
    ProductInfoSize = models.TextField()
    ProductInfoContent = models.TextField()
    Sequence = models.IntegerField()

class ProductPic(models.Model):
    '''
    产品展示图片表格。

    Product:隶属产品；
    Sequence:图片顺序；
    Picture:图片路径；
    Thumbnail:压缩图片路径；
    ImageName：图片名称。
    '''
    Product = models.ForeignKey('Products')
    Sequence = models.IntegerField()
    Picture = models.ImageField(upload_to='product_picture')
    Thumbnail = models.ImageField(upload_to='product_thumbnail')
    ImageName = models.CharField(max_length= 150)

class ProductInfoPic(models.Model):
    '''
    产品详细介绍图片表格。

    Product:隶属产品；
    Picture:图片路径；
    ImageName：图片名称；
    '''
    Product = models.ForeignKey('Products')
    Picture = models.ImageField(upload_to='product_info_picture')
    ImageName = models.CharField(max_length= 150)

class CacheProductInfoPic(models.Model):
    '''
    产品详细介绍缓存图片表格。

    Picture：保存图片的路径。
    UserID：写作者的ID。
    ImageName：图片名称。
    '''
    Picture = models.ImageField(upload_to='product_info_picture')
    UserID = models.IntegerField()
    ImageName = models.CharField(max_length= 150)

class BestProduct(models.Model):
    '''
    产品页默认推荐产品的数据表格。

    Product:隶属产品；
    ClassOne：隶属的第一级别的类；
    ClassTwo：隶属的第二级别的类；
    ProductName：产品的名字；
    '''
    Product = models.ForeignKey('Products')
    ClassOne = models.ForeignKey('ClassOne')
    ClassTwo = models.ForeignKey('ClassTwo')
    ProductName = models.CharField(max_length = 250)

#新闻相关的数据表格=========================================================
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
    ImageName:图片名称；
    '''
    News = models.ForeignKey('News')
    Picture = models.ImageField(upload_to='news_picture')
    ImageName = models.CharField(max_length= 150)

class CacheNewsPic(models.Model):
    '''
    新闻图片。

    ImageName:图片名称；
    UserID：写作者的ID；
    Picture:新闻图片；
    '''
    ImageName = models.CharField(max_length= 150)
    UserID = models.IntegerField()
    Picture = models.ImageField(upload_to='news_picture')

#人才招聘相关的数据表格=========================================================
class Job(models.Model):
    '''
    招聘信息。

    Title:标题；
    Content:招聘详细信息；
    '''
    Title = models.CharField(max_length = 200)
    Content = models.TextField()

#企业文化招聘相关的数据表格=========================================================
class Culture(models.Model):
    '''
    企业文化数据表

    Part:企业文化的字标题。默认定死三个。（企业文化:companyinfo、格力精神greemind、领导致词leaderword）
    Content:每一部分的主体内容。
    '''
    Part = models.CharField(max_length = 100)
    Content = models.TextField()

class HonorPic(models.Model):
    '''
    企业荣誉的数据表

    Picture:图片属性；
    ImageName:图片名称；
    '''
    Picture = models.ImageField(upload_to = 'honor_picture')
    ImageName = models.CharField(max_length= 150)

#联系我们相关的数据表格=========================================================
class ContactUs(models.Model):
    '''
    联系我们的数据表。

    Content:内容；
    '''
    Content = models.TextField()

#工程展示相关的数据表格=========================================================
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

class CaseFirstPic(models.Model):
    '''
    每个项目的封面图片。

    Case:项目；
    Title:项目标题；
    Thumbnail:压缩图片；
    Picture:图片；
    ImageName:图片名称；
    '''
    Case = models.ForeignKey('Case')
    Title = models.CharField(max_length = 200)
    Thumbnail = models.ImageField(upload_to='case_first_thumbnail')
    Picture = models.ImageField(upload_to='case_first_picture')
    ImageName = models.CharField(max_length= 150)


class CasePic(models.Model):
    '''
    项目图片。

    Case:项目；
    Picture:图片；
    ImageName:图片名称；
    '''
    Case = models.ForeignKey('Case')
    Picture = models.ImageField(upload_to='case_picture')
    ImageName = models.CharField(max_length= 150)

class CacheCasePic(models.Model):
    '''
    项目图片缓存。

    ImageName:图片名称；
    UserID：写作者的ID；
    Picture:项目图片；
    '''
    ImageName = models.CharField(max_length= 150)
    UserID = models.IntegerField()
    Picture = models.ImageField(upload_to='case_picture')

#店铺展示相关的数据表格=========================================================
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

class ShowFirstPic(models.Model):
    '''
    每个店面的封面图片。

    Show:店面；
    Title:店面标题；
    Thumbnail:压缩图片；
    Picture:图片；
    ImageName:图片名称；
    '''
    Show = models.ForeignKey('Show')
    Title = models.CharField(max_length = 200)
    Thumbnail = models.ImageField(upload_to='show_first_thumbnail')
    Picture = models.ImageField(upload_to='show_first_picture')
    ImageName = models.CharField(max_length= 150)

class ShowPic(models.Model):
    '''
    店面图片。

    Show:店面；
    Picture:图片；
    ImageName:图片名称；
    '''
    Show = models.ForeignKey('Show')
    Picture = models.ImageField(upload_to='show_picture')
    ImageName = models.CharField(max_length= 150)

class CacheShowPic(models.Model):
    '''
    店面图片缓存。

    ImageName:图片名称；
    UserID：写作者的ID；
    Picture:项目图片；
    '''
    ImageName = models.CharField(max_length= 150)
    UserID = models.IntegerField()
    Picture = models.ImageField(upload_to='show_picture')