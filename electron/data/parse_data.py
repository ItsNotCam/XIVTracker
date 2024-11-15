import json
import sys

allowed_types = ["items", "recipes", "icons"]
first = 0
last = 45700

if len(sys.argv) > 1 and sys.argv[1] in allowed_types:
	data_type = sys.argv[1]
	first = int(sys.argv[2]) if len(sys.argv) > 2 else 1
	last = int(sys.argv[3]) if len(sys.argv) > 3 else 45700
else:
	print("Invalid or missing type. Allowed types are: items, recipes, icons")
	sys.exit(1)

outData = {}
outFilename = ""

if data_type == allowed_types[0]:
	outFilename = "item-id-by-name.json"
	with open(f"{data_type}.json","r") as file:
		jsonData = json.load(file)
		for rowId in range(first,last):
			item = jsonData[str(rowId)]
			if item is None:
				continue

			itemName = item["en"]
			outData[itemName] = rowId
			

if data_type == allowed_types[1]:
	outFilename = "recipe-by-id.json"
	with open(f"{data_type}.json","r") as file:
		jsonData = json.load(file)
		for entry in jsonData:
			result = entry["result"]
			outData[result] = entry
	

with open(outFilename,"w") as file:
	file.write(
		json.dumps(outData, indent=2)
	)