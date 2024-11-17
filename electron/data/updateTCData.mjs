import * as fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import generateSheets from './generate.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __dataFolder = path.resolve(__dirname, "teamcraft");
const __metaFile = path.resolve(__dataFolder, ".meta")
const __rootRepoPath = "https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/refs/heads/staging/libs/data/src/lib/json"

const getNewMetaVersion = async() => {
	const response = await fetch('https://api.github.com/repos/ffxiv-teamcraft/ffxiv-teamcraft/releases?page=1&per_page=1');
	if (!response.ok) {
		throw new Error('[Update TC Data] Network failed to respond');
	}
	const data = await response.json();
	const publish_date = new Date(data[0].published_at);
	return publish_date;
}

const loadMetadata = async() => {
	console.log("[Update TC Data] Loading metadata from file:", __metaFile);
	let fileData = null;
	try {
		fileData = await fs.readFile(__metaFile);
	} catch {
		console.log("[Update TC Data] Metadata file not found, creating new one");
		return await createNewMetaFile();
	}
	
	let metadata = null;
	try {
		metadata = JSON.parse(fileData);
		console.log("[Update TC Data] Metadata loaded");
	} catch(e) {
		console.log("[Update TC Data] Failed to parse metadata file:", e);
		throw(new Error("Invalid file format", e));
	}

	return metadata;
}

const getCurrentAndLastestVersions = async(metadata) => {
	console.log("[Update TC Data] Getting current and latest versions");
	let valid = false;

	const fileData = await fs.readFile(__metaFile);
	const savedReleaseDate = new Date(metadata.tc_last_release_date);
	let repoReleaseDate = undefined;

	if(savedReleaseDate === undefined) {
		throw(new Error("[Update TC Data] Invalid meta file"));
	} else {
		repoReleaseDate = await getNewMetaVersion().catch(() => undefined);
	}

	console.log("[Update TC Data] Current version:", savedReleaseDate);
	console.log("[Update TC Data] Latest version: ", repoReleaseDate);

	return {
		currentVersion: savedReleaseDate,
		latestVersion: repoReleaseDate
	}
}

const createNewMetaFile = async() => {
	console.log("[Update TC Data] Creating new meta file");
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
		console.log("[Update TC Data] New meta file created");
	} catch(e) {
		console.log("[Update TC Data] Failed to create new meta file:", e);
		return undefined;
	}

	return metadata;
}

const getFilesToValidate = async() => {
	console.log("[Update TC Data] Getting files to validate");
	return await fs.readFile()
}

const validateAndCreateDataFolder = async() => {
	try {
		await fs.stat(__dataFolder);
		console.log("[Update TC Data] Data folder exists");
	} catch {
		await fs.mkdir(__dataFolder);
		console.log("[Update TC Data] Data folder created");
	}
}

const updateMetadataFile = async(metadata) => {
	console.log("[Update TC Data] Updating metadata file:", __metaFile);
	await fs.writeFile(__metaFile, JSON.stringify(metadata));
	console.log("[Update TC Data] Metadata file updated");
}

const downloadFiles = async (fileNames) => {
	for (const fileName of fileNames) {
		const fileUrl = `${__rootRepoPath}/${fileName}`;
		const filePath = path.resolve(__dataFolder, fileName);
		try {
			const response = await fetch(fileUrl);
			if (!response.ok) {
				throw new Error(`[Update TC Data] Failed to fetch ${fileName}`);
			}
			const fileData = await response.text();
			await fs.writeFile(filePath, fileData);
			console.log(`[Update TC Data] Downloaded and saved ${fileName}`);
		} catch (error) {
			console.error(`[Update TC Data] Error downloading ${fileName}:`, error);
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
		console.log("[Update TC Data] Already up to date, exiting");
		return; 
	}

	await updateMetadataFile({
		...metadata,
		tc_last_release_date: latestVersion
	});
	
	// get items
	await downloadFiles(metadata.files);

	// generate the new sheets
	await generateSheets(__dataFolder);
	console.log("[Update TC Data] Execution finished");
}

// only run the process automatically if this is the executed file
if (process.argv[1] === __filename) {
	const doTheThing = async () => {
		console.log("[Update TC Data] Checking for updates");
		await exec();
		console.log("[Update TC Data] Done");
	}

	doTheThing();
}