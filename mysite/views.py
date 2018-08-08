from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict

from django.http import HttpResponse
from django.template import loader
from .models import Article
import json


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
