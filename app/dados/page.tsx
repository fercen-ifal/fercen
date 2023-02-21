import dynamic from "next/dynamic";
import React from "react";

import { RegisterCharts } from "./RegisterCharts";
import { generateElectricityData } from "./electricityData";

const ElectricityAnnualReport = dynamic(() =>
	import("./reports/ElectricityAnnualReport").then(mod => mod.ElectricityAnnualReport)
);

export default function Page() {
	const electricityData = generateElectricityData();

	return (
		<>
			<RegisterCharts />

			<main className="flex flex-col gap-16">
				<ElectricityAnnualReport data={electricityData} />
			</main>
		</>
	);
}
