import { JobModel } from '@electron-lib/JobState';
import { JobIconList } from '@ui/assets/images/jobs';
import { toTitleCase } from '@ui/util/util';
import React from 'react';

interface JobProps {
	job: JobModel;
}

const Job: React.FC<JobProps> = ({ job }) => {
	const jobImageName = job?.name.toLowerCase().replace(/ /g, "-") ?? "???";
	const jobLevel     = job?.level ?? -1;
	const jobName      = toTitleCase(job?.name ?? "");

	return (
		<div className="flex flex-row gap-1 items-center">
			<img src={JobIconList[jobImageName]} className="h-[48px] w-[48px]" />
			<div className="flex flex-col">
				<span className="text-custom-text-secondary-300 bloom">Lvl. {jobLevel}</span>
				<span>{toTitleCase(jobName)}</span>
			</div>
		</div>
	);
};

export default Job;
