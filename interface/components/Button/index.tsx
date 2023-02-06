"use client";

import React, { memo, type FC, type PropsWithChildren } from "react";
import { ImSpinner2 } from "react-icons/im";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	loading?: boolean;
}

export const Button: FC<PropsWithChildren<ButtonProps>> = memo(function Component({
	children,
	className,
	loading,
	...props
}) {
	return (
		<>
			<button
				{...props}
				className={`${className} flex justify-center items-center gap-3 text-white px-2 py-1.5 rounded-sm outline-primary-darker duration-200 hover:brightness-95 active:brightness-90 disabled:brightness-75 disabled:cursor-not-allowed`}
				disabled={props.disabled || loading}
			>
				{loading ? <ImSpinner2 className="text-lg animate-spin" /> : null}
				{children}
			</button>
		</>
	);
});
