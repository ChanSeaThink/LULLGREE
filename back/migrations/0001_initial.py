# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BestProduct',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ProductName', models.CharField(max_length=250)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CacheCasePic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ImageName', models.CharField(max_length=150)),
                ('UserID', models.IntegerField(verbose_name=b'User')),
                ('Picture', models.ImageField(upload_to=b'case_picture')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CacheNewsPic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ImageName', models.CharField(max_length=150)),
                ('Picture', models.ImageField(upload_to=b'news_picture')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CacheProductInfoPic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Picture', models.ImageField(upload_to=b'product_info_picture')),
                ('ImageName', models.CharField(max_length=150)),
                ('CreateTime', models.DateTimeField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CacheShopPic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ImageName', models.CharField(max_length=150)),
                ('UserID', models.IntegerField(verbose_name=b'User')),
                ('Picture', models.ImageField(upload_to=b'shop_picture')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Case',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Title', models.CharField(max_length=200)),
                ('Content', models.TextField()),
                ('Sequence', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CaseFirstPic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Picture', models.ImageField(upload_to=b'case_first_picture')),
                ('ImageName', models.CharField(max_length=150)),
                ('Case', models.ForeignKey(to='back.Case')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='CasePic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Picture', models.ImageField(upload_to=b'case_picture')),
                ('ImageName', models.CharField(max_length=150)),
                ('Case', models.ForeignKey(to='back.Case')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ClassOne',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ClassName', models.CharField(max_length=150)),
                ('SubClassNum', models.IntegerField()),
                ('Sequence', models.IntegerField()),
                ('ProductCount', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ClassTwo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ClassName', models.CharField(max_length=150)),
                ('Sequence', models.IntegerField()),
                ('ProductCount', models.IntegerField()),
                ('PreClass', models.ForeignKey(to='back.ClassOne')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ContactUs',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Content', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Culture',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Part', models.CharField(max_length=100)),
                ('Content', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='HonorPic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Picture', models.ImageField(upload_to=b'honor_picture')),
                ('ImageName', models.CharField(max_length=150)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Job',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Title', models.CharField(max_length=200)),
                ('Content', models.TextField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Title', models.CharField(max_length=200)),
                ('ShortContent', models.CharField(max_length=400)),
                ('LongContent', models.TextField()),
                ('CreateTime', models.DateTimeField()),
                ('CreateDate', models.DateField()),
            ],
            options={
                'ordering': ['-CreateTime'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='NewsPic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Picture', models.ImageField(upload_to=b'news_picture')),
                ('ImageName', models.CharField(max_length=150)),
                ('News', models.ForeignKey(to='back.News')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ProductInfoPic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Picture', models.ImageField(upload_to=b'product_info_picture')),
                ('ImageName', models.CharField(max_length=150)),
                ('ClassOne', models.ForeignKey(to='back.ClassOne')),
                ('ClassTwo', models.ForeignKey(to='back.ClassTwo')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ProductPic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Sequence', models.IntegerField()),
                ('Picture', models.ImageField(upload_to=b'product_picture')),
                ('ImageName', models.CharField(max_length=150)),
                ('ClassOne', models.ForeignKey(to='back.ClassOne')),
                ('ClassTwo', models.ForeignKey(to='back.ClassTwo')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Products',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ProductName', models.CharField(max_length=250)),
                ('ProductInfo', models.TextField()),
                ('ProductInfoContent', models.TextField()),
                ('Sequence', models.IntegerField()),
                ('ClassOne', models.ForeignKey(to='back.ClassOne')),
                ('ClassTwo', models.ForeignKey(to='back.ClassTwo')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Shop',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Title', models.CharField(max_length=200)),
                ('Content', models.TextField()),
                ('Sequence', models.IntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ShopFirstPic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Title', models.CharField(max_length=200)),
                ('Picture', models.ImageField(upload_to=b'shop_first_picture')),
                ('ImageName', models.CharField(max_length=150)),
                ('Shop', models.ForeignKey(to='back.Shop')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ShopPic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Picture', models.ImageField(upload_to=b'shop_picture')),
                ('ImageName', models.CharField(max_length=150)),
                ('Show', models.ForeignKey(to='back.Shop')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('UserName', models.CharField(max_length=50)),
                ('PassWord', models.CharField(max_length=200)),
                ('Permission', models.IntegerField(default=0)),
                ('Time', models.DateTimeField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='productpic',
            name='Product',
            field=models.ForeignKey(to='back.Products'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='productinfopic',
            name='Product',
            field=models.ForeignKey(to='back.Products'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cacheproductinfopic',
            name='UserID',
            field=models.ForeignKey(to='back.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='cachenewspic',
            name='UserID',
            field=models.ForeignKey(to='back.User'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='bestproduct',
            name='ClassOne',
            field=models.ForeignKey(to='back.ClassOne'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='bestproduct',
            name='ClassTwo',
            field=models.ForeignKey(to='back.ClassTwo'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='bestproduct',
            name='Product',
            field=models.ForeignKey(to='back.Products'),
            preserve_default=True,
        ),
    ]
