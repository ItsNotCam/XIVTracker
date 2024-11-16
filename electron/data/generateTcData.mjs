import * as fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __dataFolder = path.resolve(__dirname, "teamcraft");
const __metaFile = path.resolve(__dataFolder, ".meta")
const __rootRepoPath = "https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/refs/heads/staging/libs/data/src/lib/json"

const getNewMetaVersion = async() => {
	console.log("getting new meta version")
	const response = await fetch('https://api.github.com/repos/ffxiv-teamcraft/ffxiv-teamcraft/releases?page=1&per_page=1');
	if (!response.ok) {
		throw new Error('Network failed to respond');
	}
	const data = await response.json();
	const publish_date = new Date(data[0].published_at);
	return new Date(data[0].published_at);
}

const loadMetadata = async() => {
	const fileData = await fs.readFile(__metaFile);
	let metadata = null;
	try {
		metadata = JSON.parse(fileData)
	} catch {
		throw(new Error("Invalid file format"));
	}

	return metadata;
}

const getCurrentAndLastestVersions = async(metadata) => {
	let valid = false;

	const fileData = await fs.readFile(__metaFile);
	const savedReleaseDate = new Date(metadata.tc_last_release_date);
	let repoReleaseDate = undefined;

	if(savedReleaseDate === undefined) {
		throw(new Error("Invalid meta file"));
	} else {
		repoReleaseDate = await getNewMetaVersion().catch(() => undefined);
	}

	return {
		currentVersion: savedReleaseDate,
		latestVersion: repoReleaseDate
	}
}

const createNewMetaFile = async() => {
	const metadata = {
		tc_last_release_date: new Date(),
		files: [
			"drop-sources.json",
			"gathering-items.json",
			"gathering-levels.json",
			"gathering-search-index.json",
			"gathering-types.json",
			"item-icons.json",
			"item-level.json",
			"items.json",
			"job-name.json",
			"map-entries.json",
			"mobs.json",
			"monsters.json",
			"nodes.json",
			"places.json",
			"recipes.json"
		]
	}

	try {
		await fs.writeFile(
			__metaFile,
			JSON.stringify(metadata)
		)
	} catch {
		return undefined;
	}

	return metadata;
}

const getFilesToValidate = async() => {
	return await fs.readFile()
}

const validateAndCreateDataFolder = async() => {
	try {
		await fs.stat(__dataFolder);
	} catch {
		await fs.mkdir(__dataFolder);
	}
}

const updateMetadataFile = async(metadata) => {
	await fs.writeFile(__metaFile, JSON.stringify(metadata));
}

const downloadFiles = async (fileNames) => {
	for (const fileName of fileNames) {
		const fileUrl = `${__rootRepoPath}/${fileName}`;
		const filePath = path.resolve(__dataFolder, fileName);
		try {
			const response = await fetch(fileUrl);
			if (!response.ok) {
				throw new Error(`Failed to fetch ${fileName}`);
			}
			const fileData = await response.text();
			await fs.writeFile(filePath, fileData);
			console.log(`Downloaded and saved ${fileName}`);
		} catch (error) {
			console.error(`Error downloading ${fileName}:`, error);
		}
	}
};

const exec = async () => {
	// create metadata folder
	await validateAndCreateDataFolder();

	// get metadata
	let metadata = await loadMetadata();
	if(!metadata) {
		metadata = await createNewMetaFile();
	}

	// check for new version
	let {
		currentVersion,
		latestVersion
	} = await getCurrentAndLastestVersions(metadata);

	// if we're up to date, exit
	if(currentVersion.toString() === latestVersion.toString()) {
		return; 
	}

	updateMetadataFile({
		...metadata,
		tc_last_release_date: latestVersion
	})
	
	// get items
	await downloadFiles(metadata.files);
}

if (process.argv[1] === __filename) {
	const doTheThing = async () => {
		console.log("executing");
		await exec();
		console.log("done");
	}

	doTheThing();
}