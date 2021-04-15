import React from 'react';
import { PlayerInfoWrapper, PlayerButtons, DifficultySwitches } from './';

const Sidebar = () => {
	return (
		<>
			<div className='runner'></div>
			<div className='sidebar'>
				<div className='sidebar-field-wrapper'>
					<PlayerInfoWrapper />
					<PlayerButtons />
				</div>
				<div className='difficulty-wrapper'>
					<DifficultySwitches />
				</div>
			</div>
		</>
	);
};

export default Sidebar;
