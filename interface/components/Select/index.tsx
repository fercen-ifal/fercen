"use client";

import { Listbox, Transition } from "@headlessui/react";

import React, { memo, type FC, type PropsWithChildren } from "react";
import { MdExpandMore } from "react-icons/md";

export interface SelectItemsShape {
	id: string;
	label: string;
}

export interface SelectProps {
	items: SelectItemsShape[];
	selected: SelectItemsShape;
	onChange: (value: SelectItemsShape) => void;
}

export const Select: FC<PropsWithChildren<SelectProps>> = memo(function Component({
	items,
	selected,
	onChange,
}) {
	return (
		<>
			<Listbox value={selected} onChange={onChange}>
				<div className="relative w-full">
					<Listbox.Button className="flex gap-5 justify-between items-center w-full px-3 py-1.5 border border-primary-dark rounded">
						{selected.label}
						<div>
							<MdExpandMore className="text-2xl" />
						</div>
					</Listbox.Button>

					<Transition
						as={React.Fragment}
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Listbox.Options className="flex flex-col absolute gap-1 w-full max-h-60 mt-1 p-2 overflow-auto rounded shadow-sm z-[2] border border-black/10 bg-white/90 backdrop-blur-sm">
							{items.map(item => (
								<Listbox.Option
									key={item.id}
									value={item}
									disabled={selected.id === item.id}
									className={`w-full p-1 text-center rounded-sm duration-200 ${
										selected.id === item.id
											? "bg-primary-main/30 cursor-default"
											: "cursor-pointer hover:bg-primary-main/20"
									}`}
								>
									{item.label}
								</Listbox.Option>
							))}
						</Listbox.Options>
					</Transition>
				</div>
			</Listbox>
		</>
	);
});
