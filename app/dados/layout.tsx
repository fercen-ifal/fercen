import { MobileMenu } from "interface/components/MobileMenu";
import React from "react";

export default async function DataLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<MobileMenu />
			<section className="flex min-h-screen h-full pt-[150px] sm:pt-[90px] print:pt-2">
				<aside
					id="menu"
					className="scale-0 sm:scale-100 flex fixed flex-col h-full sm:w-72 p-4 gap-4 z-[1] bg-gray-100 shadow sm:shadow-none transition-transform origin-top-left duration-100"
				></aside>
				<section
					id="content"
					className="flex flex-col w-full max-h-full overflow-y-auto bg-white p-8 sm:p-16 sm:pl-[calc(18rem+4rem)]"
				>
					{children}
				</section>
			</section>
		</>
	);
}
