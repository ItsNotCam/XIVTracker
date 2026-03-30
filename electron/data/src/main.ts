import { resolve } from 'path';
import { initDB, seedDbWith } from './db/db';
import { metaIsUpToDate } from './teamcraft/meta';
import { loadTeamcraftData as loadTeamcraftSheets } from './teamcraft/teamcraft';
import { mkdir } from 'fs';

const __dataFolder = resolve(__dirname, "..", "teamcraft");

export const seedDatabase = async() => {
	console.log("Creating save dir...");
	await mkdir(__dataFolder, () => {});

	const isLatestVersion = await metaIsUpToDate(__dataFolder);
	if(isLatestVersion) {
		console.log("[Update TC Data] Already up to date, exiting");
		return;
	}

	console.info("\Loading data and initializing database ...\n");
	const [_, teamcraftSheets] = await Promise.all([
		initDB(),
		loadTeamcraftSheets(__dataFolder)
	])

	console.info("\nSeeding ...\n");
	await seedDbWith(teamcraftSheets);
}

seedDatabase();