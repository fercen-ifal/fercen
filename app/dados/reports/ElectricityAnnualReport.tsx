"use client";

import type { ElectricityBill } from "entities/Electricity";
import React, { type FC, memo, useMemo, useCallback } from "react";
import { Bar, Pie } from "react-chartjs-2";

import { monthsLabel } from "../dummyData";

export interface ElectricityAnnualReportProps {
	data: ElectricityBill[];
}

export const ElectricityAnnualReport: FC<ElectricityAnnualReportProps> = memo(function Component({
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

	const totalPriceCharts = useMemo(() => {
		return years.map(year => {
			return {
				labels: data
					.filter(value => value.year === year)
					.map(value => monthsLabel[value.month.index]),
				datasets: [
					{
						label: "Valor da tarifa (R$)",
						data: data
							.filter(value => value.year === year)
							.map(value => value.totalPrice),
						backgroundColor: ["rgba(54, 162, 235, 0.2)"],
						borderColor: ["rgba(54, 162, 235, 1)"],
						borderWidth: 1,
					},
				],
			};
		});
	}, [data, years]);

	const consumptionCharts = useMemo(() => {
		return years.map(year => {
			return {
				labels: data
					.filter(value => value.year === year)
					.map(value => monthsLabel[value.month.index]),
				datasets: [
					{
						label: "Consumo em ponta (kWh)",
						data: data
							.filter(value => value.year === year)
							.map(value => value.peakConsumption.kWh),
						backgroundColor: ["rgba(255, 99, 132, 0.2)"],
						borderColor: ["rgba(255, 99, 132, 1)"],
						borderWidth: 1,
					},
					{
						label: "Consumo fora de ponta (kWh)",
						data: data
							.filter(value => value.year === year)
							.map(value => value.offpeakConsumption.kWh),
						backgroundColor: ["rgba(255, 206, 86, 0.2)"],
						borderColor: ["rgba(255, 206, 86, 1)"],
						borderWidth: 1,
					},
				],
			};
		});
	}, [data, years]);

	const totalPricePieCharts = useMemo(() => {
		return years.map(year => {
			return {
				labels: data
					.filter(value => value.year === year)
					.map(value => monthsLabel[value.month.index]),
				datasets: [
					{
						label: "Valor da tarifa (R$)",
						data: data
							.filter(value => value.year === year)
							.map(value => value.totalPrice),
						backgroundColor: [
							"rgba(255, 99, 132, 0.2)",
							"#d946ef20",
							"rgba(54, 162, 235, 0.2)",
							"rgba(255, 206, 86, 0.2)",
							"#33415520",
							"rgba(75, 192, 192, 0.2)",
							"#3b82f620",
							"#4ade8020",
							"rgba(153, 102, 255, 0.2)",
							"#6366f120",
							"rgba(255, 159, 64, 0.2)",
						],
						borderColor: [
							"rgba(255, 99, 132, 1)",
							"#d946ef",
							"rgba(54, 162, 235, 1)",
							"rgba(255, 206, 86, 1)",
							"#334155",
							"rgba(75, 192, 192, 1)",
							"#3b82f6",
							"#4ade80",
							"rgba(153, 102, 255, 1)",
							"#6366f1",
							"rgba(255, 159, 64, 1)",
						],
						borderWidth: 1,
					},
				],
			};
		});
	}, [data, years]);

	const getYearTotal = useCallback(
		(year: number) => {
			return data
				.filter(value => value.year === year)
				.map(value => value.totalPrice)
				.reduce((previous, current) => previous + current);
		},
		[data]
	);

	const getYearsDifference = useCallback(
		(yearA: number, yearB: number) => {
			const difference = getYearTotal(yearA) - getYearTotal(yearB);
			const percent = (difference / getYearTotal(yearA)) * 100;
			return percent.toFixed(2) + "%";
		},
		[getYearTotal]
	);

	const getAverageCost = useCallback(
		(year: number) => {
			const totalCost = getYearTotal(year);
			const months = data.filter(value => value.year === year).length;
			return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
				totalCost / months
			);
		},
		[data, getYearTotal]
	);

	const getHighestConsumptions = useCallback(
		(year: number) => {
			return data
				.filter(value => value.year === year)
				.sort(
					(a, b) =>
						b.peakConsumption.kWh +
						b.offpeakConsumption.kWh -
						(a.peakConsumption.kWh + a.offpeakConsumption.kWh)
				);
		},
		[data]
	);

	return (
		<>
			{years.map((year, yearIndex) => (
				<section key={year} className="flex flex-col justify-center flex-wrap gap-5">
					<h2 className="text-xl font-semibold">Relatórios anuais de {year} (energia)</h2>
					<div className="flex flex-col p-3 gap-1 rounded-sm shadow-sm bg-slate-50">
						<h3 className="text-sm font-medium pb-1 italic">Análises e feedback</h3>
						{data.filter(value => value.year === year).length < 12 ? (
							<div className="p-2 leading-none max-w-[500px] rounded bg-yellow-200/30 border border-yellow-500/30">
								<span className="text-sm">
									Atenção! Este ano não foi finalizado, as análises possuem dados
									parciais.
								</span>
							</div>
						) : null}
						<div>
							<h3>
								Custo total de{" "}
								{new Intl.NumberFormat("pt-BR", {
									style: "currency",
									currency: "BRL",
								}).format(getYearTotal(year))}
							</h3>
							{yearIndex > 0 ? (
								getYearTotal(year) > getYearTotal(year - 1) ? (
									<h3>
										Custo <span className="text-red-900">aumentou</span>{" "}
										{getYearsDifference(year, year - 1)} em relação ao ano
										passado.
									</h3>
								) : (
									<h3>
										Custo <span className="text-emerald-800">diminuiu</span>{" "}
										{getYearsDifference(year - 1, year)} em relação ao ano
										passado.
									</h3>
								)
							) : null}
							<h3>Custo médio mensal de {getAverageCost(year)}</h3>
						</div>
						<div>
							<h3>
								Mês que mais consumiu kWh:{" "}
								{monthsLabel[getHighestConsumptions(year)[0].month.index]}
							</h3>
							<h3>
								Mês que menos consumiu kWh:{" "}
								{monthsLabel[getHighestConsumptions(year).reverse()[0].month.index]}
							</h3>
						</div>
					</div>
					<div className="flex flex-col gap-5">
						<div className="w-full max-w-[500px] sm:w-[500px] print:w-full">
							<Bar
								data={totalPriceCharts[yearIndex]}
								options={{
									responsive: true,
									plugins: {
										legend: {
											position: "top",
										},
										title: {
											display: true,
											text: `Valor da tarifa por mês (${year})`,
										},
									},
								}}
							/>
						</div>
						<div className="w-full max-w-[500px] sm:w-[500px] print:w-full">
							<Bar
								data={consumptionCharts[yearIndex]}
								options={{
									responsive: true,
									plugins: {
										legend: {
											position: "top",
										},
										title: {
											display: true,
											text: `Consumo em ponta e fora de ponta por mês (${year})`,
										},
									},
								}}
							/>
						</div>
						<div className="w-full max-w-[500px] sm:w-[500px] print:w-full">
							<Pie
								data={totalPricePieCharts[yearIndex]}
								options={{
									responsive: true,
									plugins: {
										legend: {
											position: "top",
										},
										title: {
											display: true,
											text: `Influência dos meses no valor final (${year})`,
										},
									},
								}}
							/>
						</div>
					</div>
				</section>
			))}
		</>
	);
});
