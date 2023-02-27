import { DocumentAnalysisClient } from "@azure/ai-form-recognizer";
import { AzureKeyCredential } from "@azure/core-auth";

import { InternalServerError, ValidationError } from "errors/index";
import { type Files, type File, IncomingForm } from "formidable";
import fs from "fs";
import { canRequest } from "middlewares/can";
import nc, { type ApiRequest } from "models/connect";
import type { NextApiResponse } from "next";
import type { RequestHandler } from "next-connect";

export const config = {
	api: {
		bodyParser: false,
	},
};

export interface ItemsShape {
	label: string;
	total: string;
	units?: number;
	unitPrice?: number;
}

const postHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Ler conta de energia com Azure Form Recognizer
	const form = new IncomingForm({
		maxFields: 1,
		maxFiles: 1,
		allowEmptyFiles: false,
		maxFileSize: 3 * 1024 * 1024,
		filter: part => {
			return !!part.mimetype && part.mimetype.includes("pdf");
		},
	});

	const files = await new Promise<Files>(resolve =>
		form.parse(req, (err, _, files) => {
			if (err) {
				console.error(err);
				throw new InternalServerError({
					message: err.message || "Houve um erro inesperado.",
					action: "Tente novamente ou contate o suporte.",
					errorLocationCode: "API:ELECTRICITY:OCR:POST:UNEXPECTED_PARSE_ERROR",
				});
			}
			return resolve(files);
		})
	);

	if (!files.file) {
		throw new ValidationError({
			message: "É necessário que envie um arquivo do tipo PDF.",
			action: "Adicione o arquivo e tente novamente.",
			errorLocationCode: "API:ELECTRICITY:OCR:POST:FILE_MISSING",
		});
	}
	const file: File = Array.isArray(files.file) ? files.file[0] : files.file;

	const client = new DocumentAnalysisClient(
		String(process.env.COGNITIVE_API_ENDPOINT),
		new AzureKeyCredential(String(process.env.COGNITIVE_API_KEY))
	);
	const poller = await client.beginAnalyzeDocument(
		"prebuilt-invoice",
		fs.readFileSync(file.filepath)
	);

	const result = await poller.pollUntilDone();
	if (!result.documents || !result.documents[0]) {
		throw new InternalServerError({
			message: "Nenhum dado foi extraído do documento enviado.",
			action: "Tente novamente ou contate o suporte.",
			errorLocationCode: "API:ELECTRICITY:OCR:POST:DOCUMENT_NOT_FOUND",
		});
	}

	const fields = result.documents[0].fields;

	const billTotal = fields.InvoiceTotal.content;
	const total = Number(billTotal?.replaceAll(".", "").replaceAll(",", ".")) || undefined;
	const date = fields.InvoiceDate.content;
	const month = date?.split("/")[1] ? Number(date?.split("/")[1]) - 1 : undefined;
	const year = date?.split("/")[2] ? Number(date?.split("/")[2]) : undefined;

	const itemsCol = result.tables ? result.tables[1] : undefined;
	const items: ItemsShape[] = [];

	if (itemsCol) {
		const itemsColIndex = itemsCol.cells.find(
			item => item.kind === "columnHeader" && item.content.toLowerCase() === "itens faturados"
		)?.columnIndex;
		const priceColIndex = itemsCol.cells.find(
			item => item.kind === "columnHeader" && item.content.toLowerCase() === "valor (r$)"
		)?.columnIndex;

		const cells = itemsCol.cells
			.filter(
				cell =>
					cell.kind !== "columnHeader" &&
					[itemsColIndex, priceColIndex].includes(cell.columnIndex)
			)
			.map(cell => ({
				kind: cell.kind,
				rowIndex: cell.rowIndex,
				columnIndex: cell.columnIndex,
				content: cell.content,
			}));

		for (const item of cells) {
			if (item.columnIndex === itemsColIndex) {
				const contentNumbers = item.content
					.replaceAll(".", "")
					.replaceAll(", ", ".")
					.split(" ")
					.filter(value => Number(value) > 0)
					.map(value => Number(value));

				if (items[item.rowIndex - 1]) {
					items[item.rowIndex - 1] = {
						...items[item.rowIndex - 1],
						label: item.content,
						units: contentNumbers[0] || undefined,
						unitPrice: contentNumbers[1] || undefined,
					};
				} else {
					items[item.rowIndex - 1] = {
						label: item.content,
						units: contentNumbers[0] || undefined,
						unitPrice: contentNumbers[1] || undefined,
						total: "",
					};
				}
			} else if (item.columnIndex === priceColIndex) {
				// Se o item já existir na array
				if (items[item.rowIndex - 1]) {
					items[item.rowIndex - 1] = {
						...items[item.rowIndex - 1],
						total: item.content,
					};
				} else {
					items[item.rowIndex - 1] = {
						label: "",
						total: item.content,
					};
				}
			}
		}
	}

	return res.status(200).json({
		message: "Fatura lida com sucesso.",
		data: { total, date, month, year, items },
	});
};

export default nc().post(canRequest("create:electricity_bill"), postHandler);
