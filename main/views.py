# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

from main import bing

import json

# Create your views here.

from django.http import HttpResponse

def index(request):
	return render(request, 'main/index.html')


def search(request):
	search_results = None
	if request.method == 'GET':
		return HttpResponse(json.dumps(bing.run_query(request.GET['search_query'])), content_type='application/json')