import * as fs from 'fs/promises';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import generateSheets from './generate.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const __dataFolder = path.resolve(__dirname, "teamcraft");
const __metaFile = path.resolve(__dataFolder, ".meta")
const __rootRepoPath = "https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/refs/heads/staging/libs/data/src/lib/json"

// function declarations
var getNewMetaVersion = async() => {}
var loadMetadata = async() => {}
var getCurrentAndLastestVersions = async(metadata) => {}
var createNewMetaFile = async() => {}
var validateAndCreateDataFolder = async() => {}
var updateMetadataFile = async(metadata) => {}
var downloadFiles = async (fileNames) => {};

export const dataFolder = __dataFolder;

export default async function UpdateTCData() {
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

export const metaFiles = [
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

export const clearAllData = async() => {
	console.log("[Update TC Data] Clearing all data");
	try {
		const files = await fs.readdir(__dataFolder);
		for (const file of files) {
			if (file.endsWith('.json') || file.endsWith('.meta')) {
				await fs.unlink(path.join(__dataFolder, file));
			}
		}
		// await fs.rmdir(__dataFolder, { recursive: true });
		const cleared = (await fs.readdir(__dataFolder)).length === 0;
		if(cleared) {
			console.log("[Update TC Data] Data folder cleared");
		} else {
			console.log("[Update TC Data] Failed to clear data folder");
		}
	} catch(e) {
		console.log("[Update TC Data] Failed to clear data folder:", e);
	}
}

getNewMetaVersion = async() => {
	const response = await fetch('https://api.github.com/repos/ffxiv-teamcraft/ffxiv-teamcraft/releases?page=1&per_page=1');
	if (!response.ok) {
		throw new Error('[Update TC Data] Network failed to respond');
	}
	const data = await response.json();
	const publish_date = new Date(data[0].published_at);
	return publish_date;
}

loadMetadata = async() => {
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

getCurrentAndLastestVersions = async(metadata) => {
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

createNewMetaFile = async() => {
	console.log("[Update TC Data] Creating new meta file");
	const metadata = {
		tc_last_release_date: new Date(),
		files: metaFiles
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


validateAndCreateDataFolder = async() => {
	try {
		await fs.stat(__dataFolder);
		console.log("[Update TC Data] Data folder exists");
	} catch {
		await fs.mkdir(__dataFolder);
		console.log("[Update TC Data] Data folder created");
	}
}

updateMetadataFile = async(metadata) => {
	console.log("[Update TC Data] Updating metadata file:", __metaFile);
	await fs.writeFile(__metaFile, JSON.stringify(metadata));
	console.log("[Update TC Data] Metadata file updated");
}

downloadFiles = async (fileNames) => {
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

// only run the process automatically if this is the executed file
if (process.argv[1] === __filename) {
	const doTheThing = async () => {
		console.log("[Update TC Data] Checking for updates");
		await UpdateTCData();
		console.log("[Update TC Data] Done");
	}

	doTheThing();
}