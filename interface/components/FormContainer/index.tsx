import React, { memo, type PropsWithChildren } from "react";

export interface FormContainerProps {
	title: string;
}

export const FormContainer = memo(function Component({
	title,
	children,
}: PropsWithChildren<FormContainerProps>) {
	return (
		<>
			<section className="flex flex-col gap-5 w-full max-w-xl h-full px-8 py-14 bg-white shadow-md rounded-tl-[30px] rounded-tr-[30px]">
				<h3 className="font-medium text-2xl">{title}</h3>
				{children}
			</section>
		</>
	);
});
