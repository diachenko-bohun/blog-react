import React, { FC, SVGProps } from 'react';

interface ISidebarRow {
	Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
	title: string;
	onClick?: () => void;
	active?: boolean;
}

const SidebarRow: FC<ISidebarRow> = ({
	Icon,
	title,
	onClick,
	active = false,
}) => {
	const activeStyles =
		'hover:bg-gray-100 transition-all duration-200 group cursor-pointer';
	const disableStyles = 'cursor-default opacity-40';
	return (
		<div
			onClick={() => onClick?.()}
			className={`flex max-w-fit items-center space-x-2 px-2 md:px-4 py-3 rounded-full ${
				active ? activeStyles : disableStyles
			}`}
		>
			<Icon className='h-6 w-6' />
			<p className='hidden md:inline-flex group-hover:text-twitter text-base font-light lg:text-lg'>
				{title}
			</p>
		</div>
	);
};

export default SidebarRow;
