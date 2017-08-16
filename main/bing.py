import json
import requests

import os

def read_bing_key():
	bing_api_key = None
	bing_key_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'bing.key')


	try: 
		with open(bing_key_path, 'r') as f:
			bing_api_key = f.readline().strip()
	except:
		raise IOError('bing.key file not found')
	return bing_api_key


def run_query(query):
	bing_api_key = read_bing_key()
	if not bing_api_key:
		raise KeyError('Bing API key not found')

	url = 'https://api.cognitive.microsoft.com/bing/v5.0/search'
	# query string parameters
	payload = {'q': query}
	# custom headers
	headers = {'Ocp-Apim-Subscription-Key': bing_api_key}
	# make GET request
	r = requests.get(url, params=payload, headers=headers)
	# get JSON response
	return r.json()