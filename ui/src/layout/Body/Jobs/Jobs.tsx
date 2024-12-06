import JobState from '@electron-lib/JobState';
import Job from '@ui/components/jobs/Job';
import { invoke, addListener, removeListener } from '@ui/util/util';
import React, { useEffect } from 'react';

import RefreshIcon from '@mui/icons-material/Refresh';

const Jobs: React.FC = () => {
	const [jobs, setJobs] = React.useState<any[]>([]);
	const [loading, setLoading] = React.useState<boolean>(true);

	const updateJobs = (_: any, data: JobState[]) => setJobs(data);

	const askJobs = async () => {
		let data = await invoke("ask:job-all") || [];
		if (!Array.isArray(data)) {
			data = [data];
		}
		setJobs(data);
	}

	useEffect(() => {
		const getInitialJobs = async () => {
			setLoading(true);
			await askJobs();
			setLoading(false);
		}

		getInitialJobs();

		addListener("update:job-all", updateJobs);
		setLoading(false);

		return () => {
			setJobs([]);
			setLoading(false);
			removeListener("update:job-all", updateJobs);
		}
	}, []);

	return (
		<div>
			<span className="p-4 flex flex-row items-center">
				<h1 className="inline text-content-header">JOBS</h1>
			</span>
			{loading 
				? <RefreshIcon className='ml-4 animate-spin'/>
				: (
					<div className="grid grid-cols-4 flex-wrap gap-2 px-4">
						{jobs?.map((job: JobState) => <Job job={job}/>)}
					</div>
				)
			}
		</div>
	);
};

export default Jobs;