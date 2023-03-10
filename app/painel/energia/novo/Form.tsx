"use client";

import { monthsLabels } from "app/dados/electricityData";
import { Button } from "interface/components/Button";
import { Select } from "interface/components/Select";
import { TextField } from "interface/components/TextField";
import { fetcher } from "interface/utils/fetcher";
import { getURL } from "models/webserver";
import { useRouter } from "next/navigation";
import React, { type FC, memo, useState, useCallback, type FormEvent, useRef } from "react";
import { MdAdd, MdDelete, MdScience } from "react-icons/md";
import { toast } from "react-toastify";
import { useBoolean } from "react-use";

import { BillOCRModule } from "./modules/BillOCRModule";

export const Form: FC = memo(function Component() {
	const router = useRouter();
	const [isLoading, toggleLoading] = useBoolean(false);

	const [year, setYear] = useState(new Date().getFullYear());
	const [month, setMonth] = useState(new Date().getMonth());
	const [total, setTotal] = useState(0);

	const [pc_kWh, setPCkWh] = useState(0);
	const [pc_unitPrice, setPCUnitPrice] = useState(0);
	const [pc_total, setPCTotal] = useState(0);

	const [oc_kWh, setOCkWh] = useState(0);
	const [oc_unitPrice, setOCUnitPrice] = useState(0);
	const [oc_total, setOCTotal] = useState(0);

	const itemLabelInputRef = useRef<HTMLInputElement>(null);
	const itemPriceInputRef = useRef<HTMLInputElement>(null);
	const [items, setItems] = useState<{ label: string; cost: number }[]>([]);

	const calculatePCValues = useCallback(() => {
		const kWh = Number(pc_kWh);
		const unitPrice = Number(pc_unitPrice);

		if (kWh && unitPrice && !pc_total) {
			const newTotal = kWh * unitPrice;
			setPCTotal(Number(newTotal.toFixed(2)));
		} else if (kWh && pc_total && !unitPrice) {
			const newUnitPrice = pc_total / kWh;
			setPCUnitPrice(Number(newUnitPrice.toFixed(5)));
		} else if (unitPrice && pc_total && !kWh) {
			const newkWh = pc_total / unitPrice;
			setPCkWh(Number(newkWh.toFixed(2)));
		}

		if (pc_total && Number(oc_total) && !total) {
			const newTotal = pc_total + Number(oc_total);
			setTotal(Number(newTotal.toFixed(2)));
		}
	}, [pc_kWh, pc_unitPrice, pc_total, oc_total, total]);

	const calculateOCValues = useCallback(() => {
		const kWh = Number(oc_kWh);
		const unitPrice = Number(oc_unitPrice);

		if (kWh && unitPrice && !oc_total) {
			const newTotal = kWh * unitPrice;
			setOCTotal(Number(newTotal.toFixed(2)));
		} else if (kWh && oc_total && !unitPrice) {
			const newUnitPrice = oc_total / kWh;
			setOCUnitPrice(Number(newUnitPrice.toFixed(5)));
		} else if (unitPrice && oc_total && !kWh) {
			const newkWh = oc_total / unitPrice;
			setOCkWh(Number(newkWh.toFixed(2)));
		}

		if (oc_total && Number(pc_total) && !total) {
			const newTotal = oc_total + Number(pc_total);
			setTotal(Number(newTotal.toFixed(2)));
		}
	}, [oc_kWh, oc_unitPrice, oc_total, pc_total, total]);

	const onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			toggleLoading();

			if (
				!year ||
				!total ||
				!pc_kWh ||
				!pc_unitPrice ||
				!pc_total ||
				!oc_kWh ||
				!oc_unitPrice ||
				!oc_total
			) {
				toggleLoading();
				toast.info("Insira dados em todos os campos.");
				return;
			}

			const { error } = await fetcher(
				new URL("/api/electricity", getURL()),
				{
					year,
					month,
					peakConsumption: {
						kWh: pc_kWh,
						unitPrice: pc_unitPrice,
						total: pc_total,
					},
					offpeakConsumption: {
						kWh: oc_kWh,
						unitPrice: oc_unitPrice,
						total: oc_total,
					},
					totalPrice: total,
					items,
				},
				{ method: "POST" }
			);

			if (error) {
				toggleLoading();
				console.error(error);
				toast.error(error.message || "N??o foi poss??vel cadastrar a fatura.");
				return;
			}

			toggleLoading();
			toast.success("Fatura cadastrada com sucesso.");
			router.push("/painel/energia");
		},
		[
			month,
			oc_kWh,
			oc_total,
			oc_unitPrice,
			pc_kWh,
			pc_total,
			pc_unitPrice,
			total,
			year,
			items,
			router,
			toggleLoading,
		]
	);

	const addItem = useCallback(() => {
		const label = itemLabelInputRef.current?.value;
		const cost = itemPriceInputRef.current?.value;

		if (!label || !cost || isNaN(Number(cost))) {
			toast.info("Preencha o nome e o valor do item antes de adicionar.");
			return;
		}

		if (items.map(item => item.label).includes(label)) {
			toast.info("O nome do item deve ser ??nico.");
			return;
		}

		itemLabelInputRef.current.value = "";
		itemPriceInputRef.current.value = "";
		setItems(items => [...items, { label, cost: Number(cost) }]);
	}, [items]);

	return (
		<>
			<div className="flex flex-col gap-2 pb-4">
				<div className="flex gap-2">
					<h2 className="text-xl">M??dulos</h2>
					<span className="flex items-center h-fit gap-1 px-1 text-xs rounded bg-yellow-200/30 border border-yellow-500/30">
						<MdScience />
						Experimental
					</span>
				</div>

				<div>
					<BillOCRModule
						{...{
							setYear,
							setMonth,
							setTotal,
							setPCkWh,
							setPCUnitPrice,
							setPCTotal,
							setOCkWh,
							setOCUnitPrice,
							setOCTotal,
							setItems,
						}}
					/>
				</div>
			</div>

			<form onSubmit={onSubmit} className="flex flex-col gap-3">
				<div className="flex gap-3">
					<TextField
						type="number"
						placeholder="Ano:"
						min={2000}
						max={new Date().getFullYear()}
						value={String(year)}
						onChange={ev => setYear(Number(ev.target.value))}
						required
					/>
					<Select
						items={monthsLabels.map((value, index) => ({
							id: String(index),
							label: value,
						}))}
						selected={{ id: String(month), label: monthsLabels[month] }}
						onChange={value => setMonth(Number(value.id))}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<h3 className="text-sm pb-1">
						Insira os valores para o consumo <strong>em ponta</strong> deste m??s:
					</h3>
					<div className="flex gap-3">
						<TextField
							type="number"
							placeholder="Consumo de kWh em ponta (kWh):"
							min={0}
							step={0.00001}
							value={String(pc_kWh)}
							onChange={ev => setPCkWh(Number(ev.target.value))}
							onBlur={calculatePCValues}
							required
						/>
						<TextField
							type="number"
							placeholder="Pre??o do kWh em ponta (R$):"
							min={0}
							step={0.00001}
							value={String(pc_unitPrice)}
							onChange={ev => setPCUnitPrice(Number(ev.target.value))}
							onBlur={calculatePCValues}
							required
						/>
					</div>
					<TextField
						type="number"
						placeholder="Custo total de kWh em ponta (R$):"
						min={0}
						step={0.00001}
						value={String(pc_total)}
						onChange={ev => setPCTotal(Number(ev.target.value))}
						onBlur={calculatePCValues}
						required
					/>
				</div>
				<div className="flex flex-col gap-2">
					<h3 className="text-sm pb-1">
						Insira os valores para o consumo <strong>fora de ponta</strong> deste m??s:
					</h3>
					<div className="flex gap-3">
						<TextField
							type="number"
							placeholder="Consumo de kWh fora de ponta (kWh):"
							min={0}
							step={0.00001}
							value={String(oc_kWh)}
							onChange={ev => setOCkWh(Number(ev.target.value))}
							onBlur={calculateOCValues}
							required
						/>
						<TextField
							type="number"
							placeholder="Pre??o do kWh fora de ponta (R$):"
							min={0}
							step={0.00001}
							value={String(oc_unitPrice)}
							onChange={ev => setOCUnitPrice(Number(ev.target.value))}
							onBlur={calculateOCValues}
							required
						/>
					</div>
					<TextField
						type="number"
						placeholder="Custo total de kWh fora de ponta (R$):"
						min={0}
						step={0.00001}
						value={String(oc_total)}
						onChange={ev => setOCTotal(Number(ev.target.value))}
						onBlur={calculateOCValues}
						required
					/>
				</div>
				<TextField
					type="number"
					placeholder="Total da fatura (R$):"
					min={0}
					step={0.00001}
					value={String(total)}
					onChange={ev => setTotal(Number(ev.target.value))}
					required
				/>
				<div className="flex flex-col gap-2 pb-2">
					<h3 className="text-sm pb-1">Itens da fatura deste m??s (opcional):</h3>
					<ul className="flex flex-col gap-2">
						<li className="flex gap-3">
							<TextField
								ref={itemLabelInputRef}
								type="text"
								placeholder="Nome do item:"
							/>
							<TextField
								ref={itemPriceInputRef}
								type="number"
								placeholder="Valor do item (R$):"
								step={0.00001}
							/>
							<button type="button" onClick={addItem}>
								<MdAdd className="text-2xl" />
							</button>
						</li>
						{items.length > 0 ? (
							items.map((item, index) => (
								<li
									key={index}
									className="flex justify-between items-center gap-4 p-1 rounded-sm duration-200 hover:bg-slate-50"
								>
									<div className="flex justify-between items-center gap-2 w-full">
										<span className="underline w-4/5 truncate">
											{item.label}
										</span>
										<span className="w-1/5 text-right truncate">
											{new Intl.NumberFormat("pt-BR", {
												style: "currency",
												currency: "BRL",
											}).format(item.cost)}
										</span>
									</div>
									<button
										type="button"
										onClick={() => {
											setItems(items =>
												items.filter((_, itemIndex) => itemIndex !== index)
											);
										}}
									>
										<MdDelete className="text-xl" />
									</button>
								</li>
							))
						) : (
							<li className="flex justify-center items-center">
								<span className="text-center">Nenhum item adicionado.</span>
							</li>
						)}
					</ul>
				</div>
				<Button type="submit" loading={isLoading} className="bg-primary-dark">
					Cadastrar fatura
				</Button>
			</form>
		</>
	);
});
