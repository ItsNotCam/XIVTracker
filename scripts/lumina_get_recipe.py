import json
import sys

if len(sys.argv) < 2:
	print("Please provide an item name.")
	sys.exit(1)

item_name = " ".join(sys.argv[1:])
print(item_name)

with open("./lumina_data/json/items.json","r") as file:
	content = file.read()
	js = json.loads(content)
	for item_id in range(1,44400):
		row_id = str(item_id)

		item_name = js[row_id]["en"]
		