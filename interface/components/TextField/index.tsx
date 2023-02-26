"use client";

import React, {
	type HTMLProps,
	memo,
	type PropsWithChildren,
	useState,
	forwardRef,
	type RefObject,
	useEffect,
} from "react";

export interface TextFieldProps extends HTMLProps<HTMLInputElement> {
	placeholder: string;
	value?: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const TextField = memo(
	forwardRef(function Component({ children, ...props }: PropsWithChildren<TextFieldProps>, ref) {
		const [showLabel, setShowLabel] = useState(props.value ? props.value.length > 0 : false);

		useEffect(() => {
			setShowLabel(props.value ? props.value.length > 0 : false);
		}, [props.value]);

		return (
			<>
				<div className="flex flex-col relative w-full">
					<span
						className={`absolute bottom-7 pl-2 text-xs text-slate-400 transition-transform origin-bottom-left duration-200 ${
							showLabel ? "scale-100" : "scale-0"
						}`}
					>
						{props.placeholder}
					</span>
					<input
						{...props}
						ref={ref as RefObject<HTMLInputElement>}
						onChange={event => {
							props.onChange && props.onChange(event);
							if (event.target.value.length > 0) setShowLabel(true);
							else setShowLabel(false);
						}}
						className="px-2 py-1.5 bg-gray-50 rounded-sm outline-primary-main/10"
					/>
				</div>
			</>
		);
	})
);
