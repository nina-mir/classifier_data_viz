''' to create a groud truth of 20k images '''

import math, json
from random import randint

indices = range(1,10001)
keys = ["img-" + str(x) for x in indices]
vals = [randint(1, 500) for x in indices ]
iter = zip(keys, vals)
dict_item = dict(iter) 


f = open("dict-10k-images.json", "w")
json.dump(dict_item, f, indent = 6) 
f.close()