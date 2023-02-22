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
	PointElement,
	LineElement,
} from "chart.js";
import { type FC, memo, useEffect } from "react";

export const RegisterCharts: FC = memo(function Component() {
	useEffect(() => {
		ChartJS.register(
			CategoryScale,
			LinearScale,
			BarElement,
			ArcElement,
			PointElement,
			LineElement,
			Title,
			Tooltip,
			Legend
		);
	}, []);

	return null;
});
