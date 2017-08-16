
# coding: utf-8

# In[2]:

import json 
import os
from pprint import pprint
from nltk.stem import WordNetLemmatizer


# In[16]:

#import KB data
data = []
with open('howtokb/data/task-frame-test.json') as f:
    for line in f:
       data.append(json.loads(line)) 


# In[19]:

#function: locate a task given a task id, return a task object.
def locate_wikiKB(id_num, data):
    for element in data:
        if element["id"]==id_num:
            return element


# In[48]:

#function: given one task id, display the description, return a string of the verb and object. 
def display_wikiKB(id_num, data):
    element= int(id_num)
    temp = locate_wikiKB(element,data)
    a= ' '.join([temp['activity']['verb'],temp['activity']['object']])
    pprint(a)
    return a


# In[47]:

#function: map query to an object id in KB, return a list of id.
def search_wikiKB(data, search):
    outputlist=[]
    lemmatized_words=[]
    lemmatizer = WordNetLemmatizer()
    for x in search.split(): 
        lemmatized_words.append(lemmatizer.lemmatize(x,'v'))
        lemmatized_words.append(lemmatizer.lemmatize(x))
    lemmatized_string= ' '.join(lemmatized_words)
    for i in range(len(data)):
        if data[i]['activity']['verb'] in lemmatized_string and data[i]['activity']['object'] in lemmatized_string:
            outputlist.append(data[i]['id']) 
    return outputlist


# In[77]:

# function: given a task, extract subtasks, return a list of id. 
def extract_wikiKB(id_num, data):
    element= int(id_num)
    outputlist=[]
    temp = locate_wikiKB(element,data)
    outputlist=temp['activity']['sub-activity']
    return outputlist


# In[83]:

#test with this query "cage tomato seedling thin out", which should return two id numbers 

search = input('Please enter your query: ')
item1= search_wikiKB(data,search)

