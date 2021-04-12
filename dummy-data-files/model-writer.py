''' to create a ground truth of 20k images '''

import math, json, random
from random import randint



for file in range(1,10):

    # Reading the JSON file 

    # Opening JSON file
    f = open('ground-truth.json')

    orig = json.load(f)
    f.close()

    # source: https://www.kite.com/python/answers/how-to-get-a-random-entry-from-a-dictionary-in-python#
    entry_list = list(orig.items())

    random_entry = random.choice(entry_list)


    output_name = "model-" + str(file) + ".json"
    output = orig
    limit = randint(3000, 6001)

    for i in range(limit):
        random_entry = random.choice(entry_list)
        output[random_entry[0]] = randint(1, 1000)
    
    print(limit)


    f = open(output_name, "a")
    json.dump(output, f, indent = 6) 
    f.close()


# print(random_entry[0])
# print(data[random_entry[0]])