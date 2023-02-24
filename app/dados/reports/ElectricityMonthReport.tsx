"use client";

import type { ElectricityBill } from "entities/Electricity";
import dynamic from "next/dynamic";
import React, { type FC, memo, useMemo, useCallback } from "react";
import { MdWarning } from "react-icons/md";

import { monthsLabels } from "../electricityData";

const Line = dynamic(() => import("react-chartjs-2").then(mod => mod.Line), {
	loading: () => (
		<>
			<span>Carregando gráfico...</span>
		</>
	),
});

export interface ElectricityMonthReportProps {
	monthIndex: number;
	year: number;
	data: ElectricityBill[];
}

export const ElectricityMonthReport: FC<ElectricityMonthReportProps> = memo(function Component({
	monthIndex,
	year,
	data,
}) {
	const years = useMemo(() => {
		return data
			.map(value => value.year)
			.sort()
			.filter((item, pos, arr) => {
				return !pos || item != arr[pos - 1];
			});
	}, [data]);

	const monthData = useMemo(() => {
		return data.find(value => value.month === monthIndex && value.year === year);
	}, [data, monthIndex, year]);

	const lastYearMonthData = useMemo(() => {
		return data.find(value => value.month === monthIndex && value.year === year - 1);
	}, [data, monthIndex, year]);

	const totalPriceChart = useMemo(() => {
		return {
			labels: data
				.filter(value => value.month === monthIndex)
				.map(
					value =>
						`${monthsLabels[value.month]} de ${value.year} ${
							value.year === year ? "*" : ""
						}`
				),
			datasets: [
				{
					label: "Valor da tarifa (R$)",
					data: data
						.filter(value => value.month === monthIndex)
						.map(value => value.totalPrice),
					backgroundColor: ["rgba(54, 162, 235, 0.2)"],
					borderColor: ["rgba(54, 162, 235, 1)"],
					borderWidth: 1,
				},
			],
		};
	}, [data, monthIndex, year]);

	const consumptionChart = useMemo(() => {
		return {
			labels: data
				.filter(value => value.month === monthIndex)
				.map(
					value =>
						`${monthsLabels[value.month]} de ${value.year} ${
							value.year === year ? "*" : ""
						}`
				),
			datasets: [
				{
					label: "Consumo em ponta (kWh)",
					data: data
						.filter(value => value.month === monthIndex)
						.map(value => value.peakConsumption.kWh),
					backgroundColor: ["rgba(255, 99, 132, 0.2)"],
					borderColor: ["rgba(255, 99, 132, 1)"],
					borderWidth: 1,
				},
				{
					label: "Consumo fora de ponta (kWh)",
					data: data
						.filter(value => value.month === monthIndex)
						.map(value => value.offpeakConsumption.kWh),
					backgroundColor: ["rgba(255, 206, 86, 0.2)"],
					borderColor: ["rgba(255, 206, 86, 1)"],
					borderWidth: 1,
				},
			],
		};
	}, [data, monthIndex, year]);

	const getMonthsDifference = useCallback((monthA: number, monthB: number) => {
		const difference = monthA - monthB;
		const percent = (difference / monthA) * 100;
		return percent.toFixed(2) + "%";
	}, []);

	const getYearTotal = useCallback(
		(year: number) => {
			return data
				.filter(value => value.year === year)
				.map(value => value.totalPrice)
				.reduce((previous, current) => previous + current);
		},
		[data]
	);

	if (!monthData) {
		return (
			<>
				<section className="flex flex-col justify-center flex-wrap gap-5">
					<h2 className="text-2xl font-semibold">
						Relatório do mês {monthsLabels[monthIndex] || "??"} de {year} (energia)
					</h2>
					<div className="flex items-center gap-2 p-2 leading-none rounded bg-yellow-200/30 border border-yellow-500/30">
						<div>
							<MdWarning className="text-lg" />
						</div>
						<span className="text-sm">
							Não há dados de {monthsLabels[monthIndex] || "??"} de {year} cadastrados
							na plataforma. Se você achar que isto é um erro,{" "}
							<a
								href="mailto:jpnm1@aluno.ifal.edu.br?subject=(FERCEN - Erro/Bug) Digite aqui o assunto"
								className="underline"
							>
								entre em contato com o suporte FERCEN.
							</a>
						</span>
					</div>
				</section>
			</>
		);
	}

	return (
		<>
			<section className="flex flex-col justify-center flex-wrap gap-5">
				<h2 className="text-2xl font-semibold">
					Relatório do mês {monthsLabels[monthIndex]} de {year} (energia)
				</h2>
				<div className="flex flex-col p-3 gap-1 rounded-sm shadow-sm bg-slate-50">
					<h3 className="text-sm font-medium pb-1 italic">Análises e feedback</h3>
					<div className="flex flex-col gap-2 sm:gap-1">
						<h3 className="leading-none">
							Valor da fatura de{" "}
							<span className="underline decoration-primary-darker">
								{new Intl.NumberFormat("pt-BR", {
									style: "currency",
									currency: "BRL",
								}).format(monthData.totalPrice)}
							</span>
						</h3>
						{years.indexOf(year) > 0 && lastYearMonthData ? (
							monthData.totalPrice > lastYearMonthData.totalPrice ? (
								<h3 className="leading-none">
									Valor da fatura deste mês{" "}
									<span className="text-red-900">aumentou</span>{" "}
									{getMonthsDifference(
										monthData.totalPrice,
										lastYearMonthData.totalPrice
									)}{" "}
									em relação ao mesmo mês no passado.
								</h3>
							) : (
								<h3 className="leading-none">
									Valor da fatura deste mês{" "}
									<span className="text-emerald-800">diminuiu</span>{" "}
									{getMonthsDifference(
										lastYearMonthData.totalPrice,
										monthData.totalPrice
									)}{" "}
									em relação ao mesmo mês no ano passado.
								</h3>
							)
						) : null}
						<h3 className="leading-none">
							Valor da fatura deste mês corresponde a{" "}
							{((monthData.totalPrice / getYearTotal(year)) * 100).toFixed(2)}% do
							custo total deste ano.
						</h3>
					</div>
				</div>
				{monthData.composition || monthData.items ? (
					<>
						<div className="flex flex-col p-3 gap-1 rounded-sm shadow-sm bg-slate-50">
							<h3 className="text-sm font-medium pb-1 italic">
								Composição e itens da fatura
							</h3>
							{monthData.items ? (
								<ul className="list-disc">
									<div className="pb-1">
										<li className="flex justify-between items-center">
											<h4>Valor do kWh em ponta</h4>
											<strong className="font-medium">
												{new Intl.NumberFormat("pt-BR", {
													style: "currency",
													currency: "BRL",
												}).format(monthData.peakConsumption.unitPrice)}
												/kWh
											</strong>
										</li>
										<li className="flex justify-between items-center">
											<h4>Valor do kWh fora de ponta</h4>
											<strong className="font-medium">
												{new Intl.NumberFormat("pt-BR", {
													style: "currency",
													currency: "BRL",
												}).format(monthData.offpeakConsumption.unitPrice)}
												/kWh
											</strong>
										</li>
									</div>
									{monthData.items.map(item => (
										<li
											key={item.label.toLowerCase().trim()}
											className="flex justify-between items-center"
										>
											<h4>{item.label}</h4>
											<strong className="font-medium">
												{new Intl.NumberFormat("pt-BR", {
													style: "currency",
													currency: "BRL",
												}).format(item.cost)}
											</strong>
										</li>
									))}
								</ul>
							) : null}
						</div>
					</>
				) : null}
				<div className="flex flex-wrap justify-center gap-7 lg:gap-16">
					<div className="w-full max-w-[500px] sm:w-[500px] print:w-full">
						<Line
							data={totalPriceChart}
							options={{
								responsive: true,
								plugins: {
									legend: {
										position: "top",
									},
									title: {
										display: true,
										text: `Desenvolvimento do valor da tarifa dos meses ${monthsLabels[monthIndex]}`,
									},
								},
							}}
						/>
					</div>
					<div className="w-full max-w-[500px] sm:w-[500px] print:w-full">
						<Line
							data={consumptionChart}
							options={{
								responsive: true,
								plugins: {
									legend: {
										position: "top",
									},
									title: {
										display: true,
										text: `Desenvolvimento do consumo em ponta e fora de ponta dos meses ${monthsLabels[monthIndex]}`,
									},
								},
							}}
						/>
					</div>
				</div>
			</section>
		</>
	);
});
