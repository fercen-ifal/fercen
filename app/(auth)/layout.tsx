import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative flex-grow h-full">
			<div className="absolute inset-0 h-full">{children}</div>
		</div>
	);
}
