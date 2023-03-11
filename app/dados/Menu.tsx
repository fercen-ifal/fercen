"use client";

import { Button } from "interface/components/Button";
import { Select } from "interface/components/Select";
import { useRouter, useSearchParams } from "next/navigation";
import React, { type FC, memo, useState, useCallback } from "react";

import { monthsLabels } from "./electricityData";
import {
	validateMonthParam,
	validateReportParam,
	validateYearParam,
	reports,
	type ReportType,
} from "./paramsValidators";

export const Menu: FC = memo(function Component() {
	const params = useSearchParams();
	const router = useRouter();

	const [report, setReport] = useState<ReportType>(validateReportParam(params?.get("report")));
	const [year, setYear] = useState<number>(validateYearParam(params?.get("year")));
	const [month, setMonth] = useState<number>(validateMonthParam(params?.get("month")));

	const onFilter = useCallback(() => {
		const newParams = new URLSearchParams({ report, year: String(year), month: String(month) });
		router.push("/dados?" + newParams.toString());
	}, [report, year, month, router]);

	// TODO: Load available years in the year select component dynamically

	return (
		<>
			<div className="flex flex-col justify-center items-center gap-2">
				<span className="text-center text-lg font-medium">Selecione o relatório:</span>
				<Select
					items={Object.keys(reports).map(report => ({
						id: report,
						label: reports[report as ReportType],
					}))}
					selected={{ id: report, label: reports[report] }}
					onChange={value => setReport(value.id as ReportType)}
				/>
			</div>
			{["annual", "monthly", "allMonths"].includes(report) ? (
				<div className="flex flex-col justify-center items-center gap-2">
					<span className="text-center text-lg font-medium">Selecione o ano:</span>
					<Select
						items={[2021, 2022, 2023].map(value => ({
							id: String(value),
							label: String(value),
						}))}
						selected={{ id: String(year), label: String(year) }}
						onChange={value => setYear(Number(value.id))}
					/>
				</div>
			) : null}
			{report === "monthly" ? (
				<>
					<div className="flex flex-col justify-center items-center gap-2">
						<span className="text-center text-lg font-medium">Selecione o mês:</span>
						<Select
							items={monthsLabels.map((value, index) => ({
								id: String(index),
								label: value,
							}))}
							selected={{ id: String(month), label: monthsLabels[month] }}
							onChange={value => setMonth(Number(value.id))}
						/>
					</div>
				</>
			) : null}
			<Button className="bg-primary-dark" onClick={onFilter}>
				Filtrar
			</Button>
		</>
	);
});
