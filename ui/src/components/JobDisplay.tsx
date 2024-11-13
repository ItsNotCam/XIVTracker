// @ts-ignore
import * as __WebpackModuleApi from 'webpack-module-api';

import React, { useEffect } from 'react';
import XPBar from '@ui/components/XPBar';
import { JobState } from '@lib/common/commonTypes';

/* Image imports */
import AlchemistImg from "@assets/images/jobs/job-alchemist.png";
import ArcherImg from "@assets/images/jobs/job-archer.png";
import ArmorerImg from "@assets/images/jobs/job-armorer.png";
import AstrologianImg from '@assets/images/jobs/job-astrologian.png';
import BardImg from '@assets/images/jobs/job-bard.png';
import BlackMageImg from '@assets/images/jobs/job-black-mage.png';
import BlacksmithImg from "@assets/images/jobs/job-blacksmith.png";
import BlueMageImg from '@assets/images/jobs/job-blue-mage.png';
import BotanistImg from "@assets/images/jobs/job-botanist.png";
import CarpenterImg from "@assets/images/jobs/job-carpenter.png";
import CulinarianImg from "@assets/images/jobs/job-culinarian.png";
import ConjurerImg from "@assets/images/jobs/job-conjurer.png";
import DancerImg from '@assets/images/jobs/job-dancer.png';
import DarkKnightImg from "@assets/images/jobs/job-dark-knight.png";
import DragoonImg from '@assets/images/jobs/job-dragoon.png';
import FisherImg from "@assets/images/jobs/job-fisher.png";
import GoldsmithImg from "@assets/images/jobs/job-goldsmith.png";
import GunbreakerImg from "@assets/images/jobs/job-gunbreaker.png";
import LancerImg from '@assets/images/jobs/job-lancer.png';
import LeatherworkerImg from '@assets/images/jobs/job-leatherworker.png';
import MachinistImg from '@assets/images/jobs/job-machinist.png';
import MinerImg from '@assets/images/jobs/job-miner.png';
import MonkImg from '@assets/images/jobs/job-monk.png';
import NinjaImg from '@assets/images/jobs/job-ninja.png';
import PaladinImg from '@assets/images/jobs/job-paladin.png';
import PictomancerImg from '@assets/images/jobs/job-pictomancer.png';
import ReaperImg from '@assets/images/jobs/job-reaper.png';
import RedMageImg from '@assets/images/jobs/job-red-mage.png';
import SageImg from '@assets/images/jobs/job-sage.png';
import SamuraiImg from '@assets/images/jobs/job-samurai.png';
import ScholarImg from '@assets/images/jobs/job-scholar.png';
import SummonerImg from '@assets/images/jobs/job-summoner.png';
import ViperImg from '@assets/images/jobs/job-viper.png';
import WarriorImg from '@assets/images/jobs/job-warrior.png';
import WeaverImg from "@assets/images/jobs/job-weaver.png";
import WhiteMageImg from '@assets/images/jobs/job-white-mage.png';


const Images: { [key: string]: string } = {
	alchemist:      AlchemistImg,
	archer:        	ArcherImg,
	armorer:        ArmorerImg,
	astrologian:    AstrologianImg,
	bard:           BardImg,
	botanist:       BotanistImg,
	"black-mage":   BlackMageImg,
	blacksmith:     BlacksmithImg,
	"blue-mage":    BlueMageImg,
	carpenter:      CarpenterImg,
	conjurer:      	ConjurerImg,
	culinarian:     CulinarianImg,
	dancer:         DancerImg,
	"dark-knight":  DarkKnightImg,
	dragoon:        DragoonImg,
	fisher:         FisherImg,
	goldsmith:      GoldsmithImg,
	gunbreaker:     GunbreakerImg,
	lancer:     		LancerImg,
	leatherworker:  LeatherworkerImg,
	machinist:      MachinistImg,
	miner:          MinerImg,
	monk:           MonkImg,
	ninja:          NinjaImg,
	paladin:        PaladinImg,
	pictomancer:        PictomancerImg,
	reaper:         ReaperImg,
	"red-mage":     RedMageImg,
	sage:           SageImg,
	samurai:        SamuraiImg,
	scholar:        ScholarImg,
	summoner:       SummonerImg,
	viper:        ViperImg,
	warrior:        WarriorImg,
	weaver:         WeaverImg,
	"white-mage":   WhiteMageImg,
};

interface JobDisplayType {
	type: "job" | "main"
}

const JobDisplay: React.FC<JobDisplayType> = ({ type = "main" }) => {
	const [job, setJob] = React.useState<JobState>({
		level: 0,
		job_name: 'conjurer',
		current_xp: 0,
		max_xp: 0
	});

	const getJobInfo = () => {
		window.ipcRenderer.invoke(`get-${type}-job-info`).then((data: JobState | undefined) => {
			if (data === undefined) {
				setJob({ level: -1, job_name: "???", current_xp: -1, max_xp: -1 });

				setTimeout(() => {
					getJobInfo();
				}, 100);

			} else {
				console.log("job data:", data);
				setJob(data);
			}
		}).catch(e => { console.log(e) });
	}
//`/images/jobs/job-job-${job.job_name.toLowerCase().replace(" ", "-")}.png`}
	useEffect(() => {
		window.ipcRenderer.send("renderer-ready");
		window.ipcRenderer.on('setup-completed', (_event: any) => {
			getJobInfo();
		});
	}, []);

	return (
		<div className="relative grid grid-cols-[70px,1fr] grid-rows-[auto,1fr,auto] h-full w-[300px] p-4">
			<img
				className="col-start-1 col-end-2 row-start-1 row-end-3"
				src={Images[job.job_name.toLowerCase().replace(" ", "-")]}
			/>
			<h2 className="text-custom-text-secondary-300 text-xl row-start-1 row-end-2 col-start-2 col-end-3 ml-[0.6rem]">
				LEVEL {job.level}
			</h2>
			<h1 className={`
				text-custom-text-secondary-500 text-3xl font-forum col-start-2 
				col-end-3 row-start-2 row-end-3 ml-2 uppercase
			`}>
				<span className="text-[2.55rem]">{job.job_name[0]}</span>
				<span className="text-3xl">{job.job_name.slice(1).toLowerCase()}</span>
			</h1>
			<div className="col-span-2 mt-3">
				<XPBar currentXP={job.current_xp} maxXP={job.max_xp} />
			</div>
		</div>
	);
};

export default JobDisplay;