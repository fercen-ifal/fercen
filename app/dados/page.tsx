import { getElectricityBills } from "interface/hooks/getElectricityBills";
import type { Metadata } from "next";
import React from "react";

import { RegisterCharts } from "./RegisterCharts";
import { validateMonthParam, validateReportParam, validateYearParam } from "./paramsValidators";
import { ElectricityAnnualReport } from "./reports/ElectricityAnnualReport";
import { ElectricityMonthReport } from "./reports/ElectricityMonthReport";

export const metadata: Metadata = {
	title: "Visualize os dados",
	description: "Analise os dados de consumo energético dos campi do IFAL por meio de gráficos.",

	openGraph: {
		title: "Visualize os dados | FERCEN",
		description:
			"Analise os dados de consumo energético dos campi do IFAL por meio de gráficos.",
	},
};

export default async function Page({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | null };
}) {
	const report = validateReportParam(searchParams?.report || null);
	const year = validateYearParam(searchParams?.year || null);
	const month = validateMonthParam(searchParams?.month || null);

	const electricityData = await getElectricityBills();

	return (
		<>
			<RegisterCharts />

			<main className="flex flex-col gap-16">
				{report === "annual" ? (
					<ElectricityAnnualReport year={year} data={electricityData} />
				) : null}
				{report === "allYears" ? <ElectricityAnnualReport data={electricityData} /> : null}
				{report === "monthly" ? (
					<ElectricityMonthReport monthIndex={month} year={year} data={electricityData} />
				) : null}
				{report === "allMonths"
					? electricityData
							.filter(value => value.year === year)
							.sort((a, b) => a.month - b.month)
							.map(value => (
								<ElectricityMonthReport
									key={`${value.month}/${value.year}`}
									monthIndex={value.month}
									year={year}
									data={electricityData}
								/>
							))
					: null}
			</main>
		</>
	);
}
