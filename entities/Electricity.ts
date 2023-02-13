export interface ElectricityConcessionaire {
	name: string;
	contractType: string;
	connectionType: string;
	tariffModality: string;
	contractedVoltage: number;
}

export type EditableElectricityConcessionaire = Partial<ElectricityConcessionaire>;

export interface ElectricityBill {
	id: string;
	year: number;
	month: {
		id: string; // monthIndex/year
		index: number; // 0 - 11
	};
	peakConsumption: {
		kWh: number;
		unitPrice: number; // Valor do kWh
		total: number;
	};
	offpeakConsumption: {
		kWh: number;
		unitPrice: number; // Valor do kWh
		total: number;
	};
	totalPrice: number;
	// Itens faturados (soma dos itens resulta no total da fatura)
	items?: { label: string; cost: number }[];
	// Composição da tarifa
	composition?: { label: string; cost: number }[];
}

export type EditableElectricityBill = Partial<Omit<ElectricityBill, "id">>;
