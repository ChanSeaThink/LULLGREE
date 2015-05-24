# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
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
            name='CasePic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Picture', models.ImageField(upload_to=b'case_picture')),
                ('Thumbnail', models.ImageField(upload_to=b'case_thumbnail')),
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
                ('ClassName', models.CharField(max_length=50)),
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
                ('ClassName', models.CharField(max_length=50)),
                ('Sequence', models.IntegerField()),
                ('ProductCount', models.IntegerField()),
                ('PreClass', models.ForeignKey(to='back.ClassOne')),
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
                ('News', models.ForeignKey(to='back.News')),
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
                ('Thumbnail', models.ImageField(upload_to=b'product_thumbnail')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Products',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ProductName', models.CharField(max_length=50)),
                ('ProductInfo', models.TextField()),
                ('Sequence', models.IntegerField()),
                ('ClassOne', models.ForeignKey(to='back.ClassOne')),
                ('ClassTwo', models.ForeignKey(to='back.ClassTwo')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Show',
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
            name='ShowPic',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('Picture', models.ImageField(upload_to=b'show_picture')),
                ('Thumbnail', models.ImageField(upload_to=b'show_thumbnail')),
                ('Show', models.ForeignKey(to='back.Show')),
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
    ]
