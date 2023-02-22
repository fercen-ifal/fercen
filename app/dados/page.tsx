import dynamic from "next/dynamic";
import React from "react";

import { RegisterCharts } from "./RegisterCharts";
import { generateElectricityData } from "./electricityData";
import { validateMonthParam, validateReportParam, validateYearParam } from "./paramsValidators";

const ElectricityAnnualReport = dynamic(
	() => import("./reports/ElectricityAnnualReport").then(mod => mod.ElectricityAnnualReport),
	{ ssr: false }
);
const ElectricityMonthReport = dynamic(
	() => import("./reports/ElectricityMonthReport").then(mod => mod.ElectricityMonthReport),
	{ ssr: false }
);

export default function Page({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | null };
}) {
	const report = validateReportParam(searchParams?.report || null);
	const year = validateYearParam(searchParams?.year || null);
	const month = validateMonthParam(searchParams?.month || null);

	const electricityData = generateElectricityData();

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
							.map(value => (
								<ElectricityMonthReport
									key={value.month.id}
									monthIndex={value.month.index}
									year={year}
									data={electricityData}
								/>
							))
					: null}
			</main>
		</>
	);
}
