"use client";

import { Dialog } from "@headlessui/react";

import { Button } from "interface/components/Button";
import { getURL } from "models/webserver";
import type { ItemsShape } from "pages/api/electricity/ocr";
import React, { type FC, memo, useCallback, type FormEvent, useRef } from "react";
import { MdClose, MdFindInPage } from "react-icons/md";
import { toast } from "react-toastify";
import { useBoolean } from "react-use";

export interface BillOCRProps {
	setYear: (num: number) => void;
	setMonth: (num: number) => void;
	setTotal: (num: number) => void;
	setPCkWh: (num: number) => void;
	setPCUnitPrice: (num: number) => void;
	setPCTotal: (num: number) => void;
	setOCkWh: (num: number) => void;
	setOCUnitPrice: (num: number) => void;
	setOCTotal: (num: number) => void;
}

interface BillOCRApiReturn {
	message: string;
	data: {
		total?: number;
		date?: string;
		month?: number;
		year?: number;
		items: ItemsShape[];
	};
}

export const BillOCRModule: FC<BillOCRProps> = memo(function Component({
	setYear,
	setMonth,
	setTotal,
	setPCkWh,
	setPCUnitPrice,
	setPCTotal,
	setOCkWh,
	setOCUnitPrice,
	setOCTotal,
}) {
	const [isOpen, toggleOpen] = useBoolean(false);
	const [isLoading, toggleLoading] = useBoolean(false);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			toggleLoading();

			const file = fileInputRef?.current?.files ? fileInputRef.current.files[0] : undefined;
			if (!file || !file.type.includes("pdf")) {
				toast.info("Insira um arquivo do tipo PDF.");
				toggleLoading();
				return;
			}

			const body = new FormData();
			body.append("file", file);

			const res = await fetch(new URL("/api/electricity/ocr", getURL()), {
				method: "POST",
				body,
			});
			const json = await res.json();

			if (!res.ok) {
				console.error(json);
				toast.error(json.message || "Não foi possível extrir o conteúdo da fatura.");
				toggleLoading();
				return;
			}

			const data: BillOCRApiReturn = json;

			if (data.data.year) setYear(data.data.year);
			if (data.data.month) setMonth(data.data.month);
			if (data.data.total && !isNaN(data.data.total)) setTotal(data.data.total);

			for (const item of data.data.items) {
				if (item.label.toLowerCase().startsWith("consumo ponta")) {
					if (item.units) setPCkWh(item.units);
					if (item.unitPrice) setPCUnitPrice(item.unitPrice);
					setPCTotal(
						Number(item.total.replaceAll(".", "").replaceAll(",", ".")) ||
							Number(item.units) * Number(item.unitPrice)
					);
				} else if (item.label.toLowerCase().startsWith("consumo f/ponta")) {
					if (item.units) setOCkWh(item.units);
					if (item.unitPrice) setOCUnitPrice(item.unitPrice);
					setOCTotal(
						Number(item.total.replaceAll(".", "").replaceAll(",", ".")) ||
							Number(item.units) * Number(item.unitPrice)
					);
				}
			}

			toggleLoading();
			toast.success("Dados extraídos com sucesso.");
			toggleOpen();
		},
		[
			toggleLoading,
			setYear,
			setMonth,
			toggleOpen,
			setTotal,
			setPCkWh,
			setPCUnitPrice,
			setPCTotal,
			setOCkWh,
			setOCUnitPrice,
			setOCTotal,
		]
	);

	return (
		<>
			<Dialog
				open={isOpen}
				onClose={toggleOpen}
				className="flex justify-center items-center absolute h-[calc(100vh+11%)] px-4 inset-0 z-10 bg-black/10 backdrop-blur-sm"
			>
				<Dialog.Panel className="flex flex-col w-full max-w-lg gap-4 p-5 rounded bg-white">
					<div className="flex justify-between px-1">
						<Dialog.Title className="text-xl font-medium">
							Extrair dados da fatura
						</Dialog.Title>
						<MdClose role="button" className="text-3xl p-1" onClick={toggleOpen} />
					</div>
					<div className="flex items-center p-4 gap-4 bg-gray-100 rounded">
						<p className="text-sm lg:text-base">
							Este processo demora entre 15 e 20 segundos. No fim, os dados que
							conseguir extrair serão preenchidos nos campos.
						</p>
					</div>
					<form onSubmit={onSubmit} className="flex flex-col gap-3">
						<input
							ref={fileInputRef}
							id="file"
							name="file"
							type="file"
							accept="application/pdf"
						/>
						<Button type="submit" className="bg-primary-dark" loading={isLoading}>
							Extrair
						</Button>
					</form>
				</Dialog.Panel>
			</Dialog>

			<Button type="button" onClick={toggleOpen} className="bg-gray-400 !py-1 !gap-2">
				<MdFindInPage className="text-lg" />
				Extrair dados da fatura
			</Button>
		</>
	);
});
