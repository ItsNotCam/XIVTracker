import json
import sys

allowed_types = ["items", "recipes", "icons", "gathering-items", "map-entries", "monsters", "nodes"]
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

if data_type == allowed_types[2]:
	exit("Not implemented yet")

if data_type == allowed_types[3]:
	outFilename = "gathering-items-by-id.json"
	with open(f"{data_type}.json","r") as file:
		jsonData = json.load(file)
		for i in range(1,10908):
			if str(i) not in jsonData:
				continue

			result = jsonData[str(i)]
			if result is None:
				continue

			outData[result["itemId"]] = result

if data_type == allowed_types[4]:
	outFilename = "map-entries-by-id.json"
	with open(f"{data_type}.json","r") as file:
		jsonData = json.load(file)
		for entry in jsonData:
			outData[entry["id"]] = entry

if data_type == allowed_types[5]:
	outFilename = "monsters-by-id.json"
	with open(f"{data_type}.json","r") as file:
		jsonData = json.load(file)
		for key, value in jsonData.items():
				new_item = value
				new_item["rowid"] = key

				outData[value["baseid"]] = new_item

if data_type == allowed_types[6]:
	def remove_item_list(data):
		if "items" in data:
			del data["items"]
		return data

	outFilename = "nodes-by-item-id.json"
	with open(f"{data_type}.json","r") as file:
		jsonData = json.load(file)
		for key, value in jsonData.items():
			current_node = value
			items = value["items"]
			for item in items:
				item_str = str(item)
				if item_str not in outData:
					outData[item_str] = [remove_item_list(current_node)]
				else:
					outData[item_str].append(remove_item_list(current_node))

		# Sort by integer representation of id
		outData = dict(sorted(outData.items(), key=lambda item: int(item[0])))


with open(outFilename,"w") as file:
	file.write(
		json.dumps(outData, indent=2)
	)