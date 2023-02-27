import type { ElectricityBill } from "entities/Electricity";
import { fetcher } from "interface/utils/fetcher";
import { getURL } from "models/webserver";

export interface ElectricityApiReturn {
	message: string;
	bills: ElectricityBill[];
	expireSeconds?: number;
}

export const getElectricityBills = async (): Promise<ElectricityBill[] | never> => {
	const { data, error } = await fetcher<ElectricityApiReturn>(
		new URL("/api/electricity", getURL())
	);

	if (data) return data.bills;

	console.error(error);
	return [];
};
