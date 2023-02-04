import React, { type FC, memo } from "react";

export interface ModuleProps {
	title: string;
	subModules: {
		name: string;
		status: string;
		action?: {
			label: string;
			onClick?: () => void;
		};
	}[];
}

export const Module: FC<ModuleProps> = memo(function Component({ title, subModules }) {
	return (
		<div className="flex flex-col p-5 gap-2 bg-gray-100 rounded">
			<div className="w-full border-b border-b-black pb-1">
				<h2>{title}</h2>
			</div>
			<div className="flex flex-col gap-3 px-2">
				{subModules.map(subModule => (
					<div key={subModule.name} className="flex flex-col lg:flex-row lg:items-center">
						<h3 className="lg:w-full font-light">{subModule.name}</h3>
						<span className="lg:w-full font-medium lg:text-center truncate">
							{subModule.status}
						</span>
						{subModule.action ? (
							<button
								type="button"
								className="w-full font-light text-right text-primary-darker hover:underline"
								onClick={subModule.action.onClick}
							>
								{subModule.action.label}
							</button>
						) : (
							<span className="w-full"></span>
						)}
					</div>
				))}
			</div>
		</div>
	);
});
