from django.db import models

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
