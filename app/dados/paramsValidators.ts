export type ReportType = keyof typeof reports;
export const reports = {
	annual: "Anual",
	allYears: "Todos os anos",
	monthly: "Mensal",
	allMonths: "Todos os meses",
};

export const validateReportParam = (param?: string | string[] | null): ReportType => {
	if (!param) return "annual";
	if (typeof param !== "string") return "annual";
	if (!Object.keys(reports).includes(param)) return "annual";

	return param as ReportType;
};

export const validateYearParam = (param?: string | string[] | null): number => {
	const currentYear = new Date().getFullYear();

	if (!param) return currentYear;
	if (isNaN(Number(param))) return currentYear;
	if (Number(param) > currentYear || Number(param) < 2000) return currentYear;

	return Number(param);
};

export const validateMonthParam = (param?: string | string[] | null): number => {
	if (!param) return 0;
	if (isNaN(Number(param))) return 0;
	if (Number(param) > 11 || Number(param) < 0) return 0;

	return Number(param);
};
