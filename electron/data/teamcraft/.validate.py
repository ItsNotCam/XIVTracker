import os
import json

def compare_json_files(folder_path, backup_folder_path):
	print("Comparing files...", folder_path, backup_folder_path)
	for filename in os.listdir(folder_path):
		if filename.endswith('.json'):
			file_path = os.path.join(folder_path, filename)
			backup_file_path = os.path.join(backup_folder_path, filename)
			
			if not os.path.exists(backup_file_path):
				print(f"{filename}: False (backup file does not exist)")
				continue
			
			with open(file_path, 'r') as file:
				file_data = json.load(file)
			
			with open(backup_file_path, 'r') as backup_file:
				backup_file_data = json.load(backup_file)
			
			if file_data != backup_file_data:
			# 	print(f"{filename}: True")
			# else:
				print(f"{filename}: False")

# Replace 'your_folder_path' and 'your_backup_folder_path' with the actual paths
compare_json_files('./teamcraft', './teamcraft/backup')