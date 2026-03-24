// import { JobModel as JobState } from '@backend-lib/JobState';
import Job from '@components/jobs/Job';
import React, { useEffect } from 'react';

import RefreshIcon from '@mui/icons-material/Refresh';
import { useStore } from '@ui/store/store';
import { JobModel } from '@xiv-types';

const Jobs: React.FC = () => {
	const [loading, setLoading] = React.useState<boolean>(true);
	
	const { jobs } = useStore();
	useEffect(() => setLoading(jobs === null), [jobs])

	return (
		<div>
			<span className="p-4 flex flex-row items-center">
				<h1 className="inline text-content-header">JOBS</h1>
			</span>
			{loading 
				? <RefreshIcon className='ml-4 animate-spin'/>
				: (
					<div className="grid grid-cols-4 flex-wrap gap-2 px-4">
						{jobs?.map((job: JobModel) => <Job job={job}/>)}
					</div>
				)
			}
		</div>
	);
};

export default Jobs;