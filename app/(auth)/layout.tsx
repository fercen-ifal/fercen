import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="static sm:relative sm:flex-grow h-full">
			<div className="static sm:absolute inset-0 h-full">{children}</div>
		</div>
	);
}
