"use client";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
} from "chart.js";
import React from "react";
import { Bar, Pie } from "react-chartjs-2";

import { data, monthsLabel } from "./dummyData";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const years = data
	.map(value => value.year)
	.sort()
	.filter((item, pos, arr) => {
		return !pos || item != arr[pos - 1];
	});

const totalPriceCharts = years.map(year => {
	return {
		labels: data
			.filter(value => value.year === year)
			.map(value => monthsLabel[value.month.index]),
		datasets: [
			{
				label: "Valor da tarifa (R$)",
				data: data.filter(value => value.year === year).map(value => value.totalPrice),
				backgroundColor: ["rgba(54, 162, 235, 0.2)"],
				borderColor: ["rgba(54, 162, 235, 1)"],
				borderWidth: 1,
			},
		],
	};
});

const consumptionCharts = years.map(year => {
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

const totalPricePieCharts = years.map(year => {
	return {
		labels: data
			.filter(value => value.year === year)
			.map(value => monthsLabel[value.month.index]),
		datasets: [
			{
				label: "Valor da tarifa (R$)",
				data: data.filter(value => value.year === year).map(value => value.totalPrice),
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

export default function Page() {
	return (
		<>
			<main className="flex flex-wrap justify-center items-center gap-10 min-h-screen pt-[calc(150px+4rem)] sm:pt-[calc(90px+4rem)] print:pt-10 pb-16 bg-white">
				{years.map((year, yearIndex) => (
					<section key={year} className="flex flex-col justify-center flex-wrap gap-5">
						<h2 className="text-xl font-semibold">Relatórios do ano {year}</h2>
						<div className="flex flex-col gap-5">
							<div className="w-[500px] print:w-full">
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
							<div className="w-[500px] print:w-full">
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
							<div className="w-[500px] print:w-full">
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
			</main>
		</>
	);
}
