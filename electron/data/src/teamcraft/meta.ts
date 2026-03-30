import {
	readdir,
	stat,
	unlink,
	mkdir,
	writeFile,
	readFile
} from 'fs/promises';

import path from 'path';
import { TeamcraftApiMeta, XIVTeamcraftMeta } from './types';

// TODO: Fix this - the whole checking against latest... they dont output the same date format

export const getNewMetaVersion = async() => {
	const response = await fetch('https://api.github.com/repos/ffxiv-teamcraft/ffxiv-teamcraft/releases?page=1&per_page=1');
	const data: TeamcraftApiMeta = TeamcraftApiMeta.parse(await response.json());
	const publish_date = new Date(data[0]!.published_at);
	return publish_date;
}

export const loadMetadata = async(metadataFilePath: string): Promise<XIVTeamcraftMeta> => {
	console.log("[Update TC Data] Loading metadata from file:", metadataFilePath);
	let fileData = JSON.parse(await readFile(metadataFilePath, "utf-8"));
	return XIVTeamcraftMeta.parse(fileData);
}

export const getCurrentAndLastestVersions = async(metadata: XIVTeamcraftMeta) => {
	console.log("[Update TC Data] Getting current and latest versions");
	const savedReleaseDate = new Date(metadata.version);
	let repoReleaseDate = await getNewMetaVersion();

	console.log("[Update TC Data] Current version:", savedReleaseDate);
	console.log("[Update TC Data] Latest version: ", repoReleaseDate);

	return {
		currentVersion: savedReleaseDate,
		latestVersion: repoReleaseDate
	}
}

export const createNewMetaFile = async(metadataFilePath: string): Promise<XIVTeamcraftMeta> => {
	console.log("[Update TC Data] Creating new meta file");
	const metadata: XIVTeamcraftMeta = { version: new Date() }

	await writeFile(
		metadataFilePath,
		JSON.stringify(metadata)
	)
	console.log("[Update TC Data] New meta file created");

	return metadata;
}

export const validateAndCreateDataFolder = async(dataDir: string) => {
	try {
		await stat(dataDir);
		console.log("[Update TC Data] Data folder exists");
	} catch {
		await mkdir(dataDir);
		console.log("[Update TC Data] Data folder created");
	}
}

export const updateMetadataFile = async(metadata: XIVTeamcraftMeta, metadataFilePath: string) => {
	console.log("[Update TC Data] Updating metadata file:", metadataFilePath);
	await writeFile(metadataFilePath, JSON.stringify(metadata));
	console.log("[Update TC Data] Metadata file updated");
}

export const clearAllData = async(dataDir: string) => {
	console.log("[Update TC Data] Clearing all data");
	try {
		const files = await readdir(dataDir);
		for (const file of files) {
			if (file.endsWith('.json') || file.endsWith('.meta')) {
				await unlink(path.join(dataDir, file));
			}
		}

		const cleared = (await readdir(dataDir)).length === 0;
		if(cleared) {
			console.log("[Update TC Data] Data folder cleared");
		} else {
			console.log("[Update TC Data] Failed to clear data folder");
		}
	} catch(e) {
		console.log("[Update TC Data] Failed to clear data folder:", e);
	}
}

export const metaIsUpToDate = async(dataDir: string): Promise<boolean> => {
	await validateAndCreateDataFolder(dataDir);
	
	const metadataFilePath = path.join(dataDir, ".meta");

	let metadata;
	try {
		metadata = await loadMetadata(metadataFilePath);
	} catch(e: unknown) {
		metadata = await createNewMetaFile(metadataFilePath);
	}

	let { currentVersion, latestVersion } = await getCurrentAndLastestVersions(metadata);
	const isLatestVersion = currentVersion.toString() === latestVersion.toString();

	await updateMetadataFile({ version: latestVersion	}, metadataFilePath);

	return isLatestVersion;
}