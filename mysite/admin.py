from django.contrib import admin

# Register your models here.
from .models import Article


class articleAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'name',
        'votes',
        'last_voted_on',
    )


admin.site.register(Article, articleAdmin)
