import {
	readdir,
	stat,
	unlink,
	mkdir,
	writeFile,
	readFile
} from 'fs/promises';

import { resolve } from 'path';
// import { fileURLToPath } from 'url';
import generateSheets from './generate.mjs';

// TODO: These will have to be changed for release build
const __dirname = process.cwd();
const __dataFolder = resolve(__dirname, "electron/data/teamcraft");
const __metaFile = resolve(__dataFolder, ".meta")
const __rootRepoPath = "https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/refs/heads/staging/libs/data/src/lib/json"

// function declarations
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
		fileData = await readFile(__metaFile);
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

	const fileData = await readFile(__metaFile);
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
		files: metaFiles
	}

	try {
		await writeFile(
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

const validateAndCreateDataFolder = async() => {
	try {
		await stat(__dataFolder);
		console.log("[Update TC Data] Data folder exists");
	} catch {
		await mkdir(__dataFolder);
		console.log("[Update TC Data] Data folder created");
	}
}

const updateMetadataFile = async(metadata) => {
	console.log("[Update TC Data] Updating metadata file:", __metaFile);
	await writeFile(__metaFile, JSON.stringify(metadata));
	console.log("[Update TC Data] Metadata file updated");
}

const downloadFiles = async (fileNames) => {
	for (const fileName of fileNames) {
		const fileUrl = `${__rootRepoPath}/${fileName}`;
		const filePath = resolve(__dataFolder, fileName);
		try {
			const response = await fetch(fileUrl);
			if (!response.ok) {
				throw new Error(`[Update TC Data] Failed to fetch ${fileName}`);
			}
			const fileData = await response.text();
			await writeFile(filePath, fileData);
			console.log(`[Update TC Data] Downloaded and saved ${__dataFolder}/${fileName}`);
		} catch (error) {
			console.error(`[Update TC Data] Error downloading ${fileName}:`, error);
		}
	}
};

export const dataFolder = __dataFolder;

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

export const generatedfiles = [
	"xiv_gathering-items-by-id.json",
	"xiv_item-id-by-name.json",
	"xiv_map-entries-by-id.json",
	"xiv_monsters-by-id.json", 
	"xiv_nodes-by-item-id.json",
	"xiv_recipe-by-id.json"
]

export default async function UpdateTCData() {
	// create metadata folder
	await validateAndCreateDataFolder();

	// get metadata
	let metadata = await loadMetadata();
	if(!metadata) {
		metadata = await createNewMetaFile();
	}


	// if we're up to date
	let { currentVersion, latestVersion } = await getCurrentAndLastestVersions(metadata);
	const isLatestVersion = currentVersion.toString() === latestVersion.toString();

	// if all files are generated 
	const allGeneratedFiles = [...metaFiles, ...generatedfiles];
	const dataFolderFiles = await readdir(__dataFolder).then(files => files.filter(file => file.endsWith('.json')));
	const allFilesGenerated = allGeneratedFiles.every(file => dataFolderFiles.includes(file));
	
	if(dataFolderFiles.length === allGeneratedFiles.length && isLatestVersion) {
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

export const clearAllData = async() => {
	console.log("[Update TC Data] Clearing all data");
	try {
		const files = await readdir(__dataFolder);
		for (const file of files) {
			if (file.endsWith('.json') || file.endsWith('.meta')) {
				await unlink(join(__dataFolder, file));
			}
		}
		// await rmdir(__dataFolder, { recursive: true });
		const cleared = (await readdir(__dataFolder)).length === 0;
		if(cleared) {
			console.log("[Update TC Data] Data folder cleared");
		} else {
			console.log("[Update TC Data] Failed to clear data folder");
		}
	} catch(e) {
		console.log("[Update TC Data] Failed to clear data folder:", e);
	}
}
// run generate tc data if running this file directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
	UpdateTCData().catch(console.error);
}