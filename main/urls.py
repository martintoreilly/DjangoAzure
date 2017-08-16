from django.conf.urls import url
from main import views

urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^search/$', views.search, name='search'),
]