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
import dynamic from "next/dynamic";
import React from "react";

import { data } from "./dummyData";

const ElectricityAnnualReport = dynamic(() =>
	import("./reports/ElectricityAnnualReport").then(mod => mod.ElectricityAnnualReport)
);

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// TODO: Make this page a server component

export default function Page() {
	return (
		<>
			<main className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-center sm:items-start gap-10 min-h-screen pt-[calc(150px+4rem)] sm:pt-[calc(90px+4rem)] print:pt-10 pb-16 px-6 bg-white">
				<ElectricityAnnualReport data={data} />
			</main>
		</>
	);
}
