import { ElectricityBill } from "entities/Electricity";
import { fetcher } from "interface/utils/fetcher";
import { getURL } from "models/webserver";
import dynamic from "next/dynamic";
import React from "react";

import { RegisterCharts } from "./RegisterCharts";
import { validateMonthParam, validateReportParam, validateYearParam } from "./paramsValidators";

const ElectricityAnnualReport = dynamic(
	() => import("./reports/ElectricityAnnualReport").then(mod => mod.ElectricityAnnualReport),
	{ ssr: false }
);
const ElectricityMonthReport = dynamic(
	() => import("./reports/ElectricityMonthReport").then(mod => mod.ElectricityMonthReport),
	{ ssr: false }
);

export const revalidate = 120;

export default async function Page({
	searchParams,
}: {
	searchParams?: { [key: string]: string | string[] | null };
}) {
	const report = validateReportParam(searchParams?.report || null);
	const year = validateYearParam(searchParams?.year || null);
	const month = validateMonthParam(searchParams?.month || null);

	const electricity = await fetcher<{ bills: ElectricityBill[] }>(
		new URL("/api/electricity", getURL()),
		undefined,
		{ next: { revalidate: 120 } }
	);
	const electricityData = electricity.data?.bills || [];

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
