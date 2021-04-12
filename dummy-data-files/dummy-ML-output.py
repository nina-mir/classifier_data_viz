import math, json, random

''' script to create a radial set of points covering 360 degrees '''

mylist = []

#             {angle: 3.14 * .5, radius: 35}

range_items = range (1000)
num_classes = len(range_items)
print(num_classes)
# print(2*math.pi/num_classes)

dict_item = {
    "angle" : 0,
    "radius": 200
}

mylist.append(dict_item)

f = open("json_1000.radialLine", "a")

json.dump(dict_item, f, indent = 6) 


f.write(',')
for i in range_items:

    dict_item["angle"]=dict_item["angle"] + 2* math.pi/num_classes

    dict_item["radius"] = 200 + random.randint(0, 10)

    # f.write(str(dict_item) )
    json.dump(dict_item, f, indent = 6) 

    f.write(',')
    # print(dict_item)

    # mylist.append(dict_item)
    
f.close()
