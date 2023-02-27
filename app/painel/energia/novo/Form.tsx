"use client";

import { monthsLabels } from "app/dados/electricityData";
import { Button } from "interface/components/Button";
import { Select } from "interface/components/Select";
import { TextField } from "interface/components/TextField";
import { fetcher } from "interface/utils/fetcher";
import { getURL } from "models/webserver";
import { useRouter } from "next/navigation";
import React, { type FC, memo, useState, useCallback, type FormEvent } from "react";
import { MdScience } from "react-icons/md";
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

	const calculatePCValues = useCallback(() => {
		const kWh = Number(pc_kWh);
		const unitPrice = Number(pc_unitPrice);
		const total = Number(pc_total);

		if (kWh && unitPrice && !total) {
			const newTotal = kWh * unitPrice;
			setPCTotal(Number(newTotal.toFixed(2)));
		} else if (kWh && total && !unitPrice) {
			const newUnitPrice = total / kWh;
			setPCUnitPrice(Number(newUnitPrice.toFixed(5)));
		} else if (unitPrice && total && !kWh) {
			const newkWh = total / unitPrice;
			setPCkWh(Number(newkWh.toFixed(2)));
		}

		if (total && Number(oc_total)) setTotal(total + Number(oc_total));
	}, [pc_kWh, pc_unitPrice, pc_total, oc_total]);

	const calculateOCValues = useCallback(() => {
		const kWh = Number(oc_kWh);
		const unitPrice = Number(oc_unitPrice);
		const total = Number(oc_total);

		if (kWh && unitPrice && !total) {
			const newTotal = kWh * unitPrice;
			setOCTotal(Number(newTotal.toFixed(2)));
		} else if (kWh && total && !unitPrice) {
			const newUnitPrice = total / kWh;
			setOCUnitPrice(Number(newUnitPrice.toFixed(5)));
		} else if (unitPrice && total && !kWh) {
			const newkWh = total / unitPrice;
			setOCkWh(Number(newkWh.toFixed(2)));
		}

		if (total && Number(pc_total)) setTotal(total + Number(pc_total));
	}, [oc_kWh, oc_unitPrice, oc_total, pc_total]);

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
				},
				{ method: "POST" }
			);

			if (error) {
				toggleLoading();
				console.error(error);
				toast.error(error.message || "Não foi possível cadastrar a fatura.");
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
			router,
			toggleLoading,
		]
	);

	return (
		<>
			<div className="flex flex-col gap-2 pb-4">
				<div className="flex gap-2">
					<h2 className="text-xl">Módulos</h2>
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
						Insira os valores para o consumo <strong>em ponta</strong> deste mês:
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
							placeholder="Preço do kWh em ponta (R$):"
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
						Insira os valores para o consumo <strong>fora de ponta</strong> deste mês:
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
							placeholder="Preço do kWh fora de ponta (R$):"
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
				<Button type="submit" loading={isLoading} className="bg-primary-dark">
					Cadastrar fatura
				</Button>
			</form>
		</>
	);
});
