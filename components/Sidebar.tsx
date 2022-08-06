import React from 'react';

import {
	BellIcon,
	HashtagIcon,
	BookmarkIcon,
	CollectionIcon,
	DotsCircleHorizontalIcon,
	MailIcon,
	UserIcon,
	HomeIcon,
} from '@heroicons/react/outline';
import SidebarRow from './SidebarRow';
import { useSession, signOut, signIn } from 'next-auth/react';

function Sidebar() {
	const { data: session } = useSession();
	const list = [
		{ icon: HomeIcon, title: 'Home', onClick: () => {}, active: true },
		{
			icon: UserIcon,
			title: session ? 'Sign Out' : 'Sign In',
			onClick: session ? signOut : signIn,
			active: true,
		},
		{ icon: HashtagIcon, title: 'Explore', onClick: () => {} },
		{ icon: BellIcon, title: 'Notifications', onClick: () => {} },
		{ icon: MailIcon, title: 'Massages', onClick: () => {} },
		{ icon: BookmarkIcon, title: 'Bookmarks', onClick: () => {} },
		{ icon: CollectionIcon, title: 'Lists', onClick: () => {} },
		{ icon: DotsCircleHorizontalIcon, title: 'More', onClick: () => {} },
	];
	return (
		<div className='flex flex-col col-span-1 md:col-span-2 items-center md:px-4 md:items-start'>
			<img
				className='h-7 w-7 md:h-10 md:w-10 md:m-3'
				src='https://links.papareact.com/drq'
				alt='Logo'
			/>
			{list.map((item, i) => (
				<SidebarRow
					key={i}
					Icon={item.icon}
					title={item.title}
					onClick={item.onClick}
					active={item?.active}
				/>
			))}
		</div>
	);
}

export default Sidebar;
