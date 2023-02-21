import type { ElectricityBill } from "entities/Electricity";
import { v4 as uuid } from "uuid";

function rng(max: number, min: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const monthsLabels = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro",
];

export const generateElectricityData = (): ElectricityBill[] => {
	return [
		// 2021
		{
			id: uuid(),
			year: 2021,
			month: {
				id: "00/2021",
				index: 0, // Janeiro
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2021,
			month: {
				id: "01/2021",
				index: 1, // Fevereiro
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2021,
			month: {
				id: "02/2021",
				index: 2, // Março
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2021,
			month: {
				id: "03/2021",
				index: 3, // Abril
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2021,
			month: {
				id: "04/2021",
				index: 4, // Maio
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2021,
			month: {
				id: "05/2021",
				index: 5, // Junho
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2021,
			month: {
				id: "06/2021",
				index: 6, // Julho
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2021,
			month: {
				id: "07/2021",
				index: 7, // Agosto
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2021,
			month: {
				id: "08/2021",
				index: 8, // Setembro
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2021,
			month: {
				id: "09/2021",
				index: 9, // Outubro
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2021,
			month: {
				id: "10/2021",
				index: 10, // Novembro
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2021,
			month: {
				id: "11/2021",
				index: 11, // Dezembro
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},

		// 2022

		{
			id: uuid(),
			year: 2022,
			month: {
				id: "00/2022",
				index: 0, // Janeiro
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2022,
			month: {
				id: "01/2022",
				index: 1, // Fevereiro
			},
			peakConsumption: {
				kWh: 1_042,
				unitPrice: 1.90435,
				total: 1_984.33,
			},
			offpeakConsumption: {
				kWh: 4_392,
				unitPrice: 0.31758,
				total: 1_394.81,
			},
			totalPrice: 3_863.29,
			items: [
				{
					label: "Consumo ponta",
					cost: 1_984.33,
				},
				{ label: "Consumo fora de ponta", cost: 1_394.81 },
			],
		},
		{
			id: uuid(),
			year: 2022,
			month: {
				id: "02/2022",
				index: 2, // Março
			},
			peakConsumption: {
				kWh: 1_559,
				unitPrice: 1.90435,
				total: 2_968.88,
			},
			offpeakConsumption: {
				kWh: 6_514,
				unitPrice: 0.31758,
				total: 2_068.71,
			},
			totalPrice: 3_892.74,
			items: [
				{
					label: "Consumo ponta",
					cost: 2_968.88,
				},
				{ label: "Consumo fora de ponta", cost: 2_068.71 },
			],
		},
		{
			id: uuid(),
			year: 2022,
			month: {
				id: "03/2022",
				index: 3, // Abril
			},
			peakConsumption: {
				kWh: 3_390,
				unitPrice: 1.90435,
				total: 6_455.74,
			},
			offpeakConsumption: {
				kWh: 13_879,
				unitPrice: 0.31758,
				total: 4_407.69,
			},
			totalPrice: 4_056.39,
			items: [
				{
					label: "Consumo ponta",
					cost: 6_455.74,
				},
				{ label: "Consumo fora de ponta", cost: 4_407.69 },
			],
		},
		{
			id: uuid(),
			year: 2022,
			month: {
				id: "04/2022",
				index: 4, // Maio
			},
			peakConsumption: {
				kWh: 2_448,
				unitPrice: 2.20247,
				total: 5_391.64,
			},
			offpeakConsumption: {
				kWh: 15_298,
				unitPrice: 0.384139,
				total: 5_876.55,
			},
			totalPrice: 8_078.04,
			items: [
				{
					label: "Consumo ponta",
					cost: 5_391.64,
				},
				{ label: "Consumo fora de ponta", cost: 5_876.55 },
			],
		},
		{
			id: uuid(),
			year: 2022,
			month: {
				id: "05/2022",
				index: 5, // Junho
			},
			peakConsumption: {
				kWh: 3_638,
				unitPrice: 2.743869,
				total: 9_982.19,
			},
			offpeakConsumption: {
				kWh: 12_092,
				unitPrice: 0.479806,
				total: 5_801.81,
			},
			totalPrice: 19_082.1,
			items: [
				{
					label: "Consumo ponta",
					cost: 9_982.19,
				},
				{ label: "Consumo fora de ponta", cost: 5_801.81 },
			],
		},
		{
			id: uuid(),
			year: 2022,
			month: {
				id: "06/2022",
				index: 6, // Julho
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2022,
			month: {
				id: "07/2022",
				index: 7, // Agosto
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2022,
			month: {
				id: "08/2022",
				index: 8, // Setembro
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2022,
			month: {
				id: "09/2022",
				index: 9, // Outubro
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2022,
			month: {
				id: "10/2022",
				index: 10, // Novembro
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
		{
			id: uuid(),
			year: 2022,
			month: {
				id: "11/2022",
				index: 11, // Dezembro
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},

		// 2023

		{
			id: uuid(),
			year: 2023,
			month: {
				id: "00/2023",
				index: 0, // Janeiro
			},
			peakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			offpeakConsumption: {
				kWh: rng(5_000, 1_000),
				unitPrice: rng(3, 1),
				total: rng(20_000, 3_000),
			},
			totalPrice: rng(20_000, 3_000),
		},
	];
};
