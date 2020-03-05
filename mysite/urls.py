from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('save-article/', views.save_article, name='save_article'),
    path('get-states/', views.get_states, name='get_states'),
    path('get-schools/', views.get_schools, name='get_schools'),
]