import React from 'react';
import UserTitleCard from '@ui/components/ui/UserTitleCard';
import ConnectionStatus from '@ui/components/ui/ConnectionStatus';

const Sidebar: React.FC = () => (
	<div className='w-50 bg-[hsl(36,33%,3%)] h-full border-r border-[hsl(42,45%,17%)] flex flex-col overflow-hidden'>
		<UserTitleCard />
		<ConnectionStatus />
	</div>
)

export default Sidebar;