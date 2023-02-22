import dynamic from "next/dynamic";
import React from "react";

import { RegisterCharts } from "./RegisterCharts";
import { generateElectricityData } from "./electricityData";

const ElectricityAnnualReport = dynamic(() =>
	import("./reports/ElectricityAnnualReport").then(mod => mod.ElectricityAnnualReport)
);
const ElectricityMonthReport = dynamic(() =>
	import("./reports/ElectricityMonthReport").then(mod => mod.ElectricityMonthReport)
);

export default function Page() {
	const electricityData = generateElectricityData();

	return (
		<>
			<RegisterCharts />

			<main className="flex flex-col gap-16">
				<ElectricityMonthReport monthIndex={0} year={2022} data={electricityData} />
				<ElectricityAnnualReport data={electricityData} />
			</main>
		</>
	);
}
