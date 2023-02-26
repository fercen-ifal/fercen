"use client";

import { Disclosure, Popover } from "@headlessui/react";

import { monthsLabels } from "app/dados/electricityData";
import type { ElectricityBill } from "entities/Electricity";
import { fetcher } from "interface/utils/fetcher";
import { getURL } from "models/webserver";
import { useRouter } from "next/navigation";
import React, { type FC, memo, useMemo, useCallback } from "react";
import { MdDelete, MdEdit, MdExpandMore } from "react-icons/md";
import { toast } from "react-toastify";

export interface ElectricityBillsProps {
	bills: ElectricityBill[];
}

export const ElectricityBills: FC<ElectricityBillsProps> = memo(function Component({ bills }) {
	const router = useRouter();

	const years: number[] = useMemo(() => {
		return bills
			.map(value => value.year)
			.sort()
			.filter((item, pos, arr) => {
				return !pos || item != arr[pos - 1];
			});
	}, [bills]);

	const deleteBill = useCallback(
		async (id: string) => {
			const { error } = await fetcher(
				new URL("/api/electricity", getURL()),
				{
					id,
				},
				{ method: "DELETE" }
			);

			if (error) {
				console.error(error);
				toast.error(error.message || "Não foi possível deletar esta conta.");
				return;
			}

			toast.success("Conta de energia deletada com sucesso.");
			router.refresh();
		},
		[router]
	);

	return (
		<>
			<section className="flex flex-col w-full gap-3">
				{years.map(year => (
					<Disclosure key={year} as="div" className="flex flex-col w-full">
						{({ open }) => (
							<>
								<Disclosure.Button
									className={`flex justify-between items-center p-2 gap-3 bg-gray-100 ${
										open ? "rounded-t-sm" : "rounded-sm"
									}`}
								>
									<span className="text-lg font-medium text-left">
										Contas de energia de {year}
									</span>
									<div>
										<MdExpandMore
											className={`text-2xl duration-200 transition-transform ${
												open ? "rotate-180" : "rotate-0"
											}`}
										/>
									</div>
								</Disclosure.Button>

								<Disclosure.Panel className="py-2 rounded-b-sm bg-gray-50">
									<ul className="flex flex-col gap-1">
										{bills
											.filter(value => value.year === year)
											.sort((a, b) => a.month - b.month)
											.map(bill => (
												<li
													key={bill.id}
													className="flex justify-between items-center w-full px-4 py-1 duration-100 bg-gray-50 hover:brightness-95"
												>
													<span>
														{monthsLabels[bill.month]} de {bill.year}
													</span>
													<div
														aria-label="Menu de ações da conta de energia"
														className="flex items-center gap-2"
													>
														<button aria-label="Edita a conta de energia">
															<MdEdit className="text-xl" />
														</button>
														<Popover as={React.Fragment}>
															<Popover.Button>
																<MdDelete className="text-xl" />
															</Popover.Button>
															<Popover.Panel className="flex flex-col absolute w-fit right-10 p-2 bg-white border border-black/10 rounded shadow-sm z-[2]">
																<button
																	aria-label="Deleta a conta de energia"
																	onClick={() =>
																		deleteBill(bill.id)
																	}
																	className="text-sm hover:underline"
																>
																	Clique aqui para confirmar
																</button>
															</Popover.Panel>
														</Popover>
													</div>
												</li>
											))}
									</ul>
								</Disclosure.Panel>
							</>
						)}
					</Disclosure>
				))}
			</section>
		</>
	);
});
