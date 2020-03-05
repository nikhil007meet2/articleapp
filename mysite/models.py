from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Article(models.Model):
    title = models.CharField(max_length=200, db_index=True)
    name = models.CharField(max_length=200, db_index=True)
    content = models.TextField()
    votes = models.IntegerField(default=0)
    last_voted_on = models.DateTimeField(db_index=True, auto_now=True)

    class Meta:
        db_table = 'Article'
        verbose_name = 'Article'
        verbose_name_plural = 'Articles'

class State(models.Model):
    state_code = models.CharField(max_length=200, db_index=True)
    state_name = models.CharField(max_length=200, db_index=True)
    last_modified_on = models.DateTimeField(db_index=True, auto_now=True)

    class Meta:
        db_table = 'State'
        verbose_name = 'State'
        verbose_name_plural = 'States'
    
    def __str__(self):
        return u'%s' % (self.state_name)

class District(models.Model):
    district_name = models.CharField(max_length=200, db_index=True)
    state = models.ForeignKey(State, on_delete=models.PROTECT)
    district_head_name = models.CharField(max_length=200, db_index=True)
    district_contact_name = models.IntegerField(max_length=20, db_index=True, blank=True)
    district_email_name = models.EmailField(max_length=70,blank=True)
    mswo_head_name = models.CharField(max_length=200, db_index=True)
    mswo_contact_name = models.IntegerField(max_length=20, db_index=True, blank=True)
    mswo_email_name = models.EmailField(max_length=70,blank=True)
    last_modified_on = models.DateTimeField(db_index=True, auto_now=True)

    class Meta:
        db_table = 'District'
        verbose_name = 'District'
        verbose_name_plural = 'Districts'
    def __str__(self):
        return u'%s' % (self.district_name)
    


class Subject(models.Model):
    subject_name = models.CharField(max_length=200, db_index=True)
    grade = models.CharField(max_length=200, db_index=True)
    class Meta:
        db_table = 'Subject'
        verbose_name = 'Subject'
        verbose_name_plural = 'Subjects'

class School(models.Model):
    name = models.CharField(max_length=200, db_index=True)
    district = models.ForeignKey(District, on_delete=models.PROTECT)
    aided = models.BooleanField(default=True)
    principle = models.ForeignKey(User, on_delete=models.PROTECT)
    contact_no = models.IntegerField(max_length=20, blank=True)
    school_email = models.EmailField(max_length=70,blank=True)
    address_1 = models.TextField(blank=True)
    address_2 = models.TextField(blank=True)
    class Meta:
        db_table = 'School'
        verbose_name = 'School'
        verbose_name_plural = 'Schools'
    def __str__(self):
        return u'%s' % (self.name)



class Teacher(models.Model):
    teacher_name = models.CharField(max_length=200, db_index=True)
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    dob = models.DateField(max_length=8)
    qualification = models.CharField(max_length=50)
    school = models.ForeignKey(School, on_delete=models.PROTECT)
    class Meta:
        db_table = 'Teacher'
        verbose_name = 'Teacher'
        verbose_name_plural = 'Teachers'


    

