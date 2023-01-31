"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { type FC, memo, PropsWithChildren } from "react";

export interface SubModuleProps {
	name: string;
	href: string;
}

export const SubModule: FC<PropsWithChildren<SubModuleProps>> = memo(function Component({
	children,
	name,
	href,
}) {
	const pathname = usePathname();

	return (
		<>
			<Link
				href={href}
				className={`flex items-center gap-2 p-1 px-2 bg-gray-100 duration-200 ${
					pathname === href ? "brightness-95" : "hover:brightness-95"
				}`}
			>
				{children}
				<span className="max-w-full truncate">{name}</span>
			</Link>
		</>
	);
});
