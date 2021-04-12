import math, json
from random import randint

''' script to create a set of 20k dummmy images each assigened to a random class between 1 to 1000 '''

flag = False

if flag:

    range_items = range (10000)
    num_images = len(range_items)

    dict_item = {
        "image" : 1,
        "class": 1
    }

    f = open("./10k-images.json", "a")

    json.dump(dict_item, f, indent = 6) 

    f.write(',')
    for i in range_items:

        dict_item["image"] += 1

        dict_item["class"] =  randint(1, 1000)  

        json.dump(dict_item, f, indent = 6) 

        f.write(',')
        
    f.close()

# Reading the JSON file 

# Opening JSON file
f = open("10k-images.json",)
  
# returns JSON object as 
# a dictionary
data = json.load(f)

print(type(data))
print(len(data))
