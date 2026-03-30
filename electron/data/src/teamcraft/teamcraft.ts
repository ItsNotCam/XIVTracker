import { writeFile } from "fs/promises";
import { resolve } from "path";

const __rootRepoPath = "https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/refs/heads/staging/libs/data/src/lib/json"

export const teamcraftSheets = [
	"drop-sources",
	"gathering-items",
	"gathering-levels",
	"gathering-search-index",
	"gathering-types",
	"item-icons",
	"item-level",
	"items",
	"job-name",
	"map-entries",
	"mobs",
	"monsters",
	"nodes",
	"places",
	"recipes"
]

export const loadTeamcraftData = async (saveDir: string): Promise<Record<string, unknown>> => {
	const resultsEntries = await Promise.all(
		teamcraftSheets.map(async(teamcraftSheetName): Promise<[ string, unknown]> => {
			const fileName = `${teamcraftSheetName}.json`
			const fileUrl = `${__rootRepoPath}/${fileName}`;
			const filePath = resolve(saveDir, `${teamcraftSheetName}.json`);

			const data = await fetch(fileUrl)
				.then((response) => response.json())
				.then(async(data) => {
					await writeFile(filePath, JSON.stringify(data))
					console.log(`[Update TC Data] Downloaded and saved ${saveDir}/${fileName}`);
					return data;
				})

			return [ teamcraftSheetName, data ]
		}
	))

	return Object.fromEntries(resultsEntries);
}