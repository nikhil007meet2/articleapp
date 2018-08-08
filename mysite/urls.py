from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('save-article/', views.save_article, name='save_article'),
]