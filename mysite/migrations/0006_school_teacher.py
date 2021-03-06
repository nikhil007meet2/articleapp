# Generated by Django 2.1 on 2019-07-31 09:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('mysite', '0005_district'),
    ]

    operations = [
        migrations.CreateModel(
            name='School',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('aided', models.BooleanField(default=True)),
                ('contact_no', models.IntegerField(blank=True, max_length=20)),
                ('school_email', models.EmailField(blank=True, max_length=70)),
                ('address_1', models.TextField(blank=True)),
                ('address_2', models.TextField(blank=True)),
                ('district', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='mysite.District')),
                ('principle', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'School',
                'verbose_name_plural': 'Schools',
                'db_table': 'School',
            },
        ),
        migrations.CreateModel(
            name='Teacher',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('teacher_name', models.CharField(db_index=True, max_length=200)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female')], max_length=1)),
                ('dob', models.DateField(max_length=8)),
                ('qualification', models.CharField(max_length=50)),
                ('school', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='mysite.School')),
            ],
            options={
                'verbose_name': 'Teacher',
                'verbose_name_plural': 'Teachers',
                'db_table': 'Teacher',
            },
        ),
    ]
