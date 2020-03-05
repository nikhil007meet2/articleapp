from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.template import loader
from .models import Article, State, School
from googletrans import Translator
import json, datetime

translator = Translator(service_urls=[
      'translate.google.in'
    ])

def index(request):
    article_list = Article.objects.order_by('-votes').values(
        'id', 'title', 'name', 'content', 'votes')

    data = {'article_dump': json.dumps({"data": list(article_list)})}
    template = loader.get_template('mysite/home.html')
    return HttpResponse(template.render(data, request))


@csrf_exempt
def save_article(request):
    if not request.is_ajax():
        return

    if request.POST['id'] == '':
        article = Article()
        article.name = request.POST['name'].strip()
        print(article.name)
        article.title = request.POST['title'].strip()
        article.content = request.POST['content'].strip()
        article.save()
    else:
        article = Article.objects.get(pk=int(request.POST['id']))
        article.votes += 1

        article.save()

    return HttpResponse(
        json.dumps({
            'article_rec': model_to_dict(article)
        }),
        content_type='application/json')

@csrf_exempt
def get_states(request):
    state = State.objects.values()
    print (state)
    return HttpResponse(
        json.dumps({
            'state_rec': list(state)
        }, default=datetime_handler),
        content_type='application/json')

@csrf_exempt
def get_schools(request):
    if request.user.username is None:
        return HttpResponse(
        json.dumps({
            'error': 'Login Required'
        }, default=datetime_handler),
        content_type='application/json')

    school = School.objects.values('name', 'district', 'district__district_name', 'district__state__state_name', 'aided', 'principle', 
        'principle__username', 'principle__first_name', 'principle__last_name', 'contact_no', 'school_email', 'address_1', 'address_2')
    return HttpResponse(
        json.dumps({
            'school_rec': list(school)
        }, default=datetime_handler),
        content_type='application/json')

def datetime_handler(x):
    if isinstance(x, datetime.datetime):
        return x.isoformat()
    raise TypeError("Unknown type")