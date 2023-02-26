import { ElectricityBill } from "entities/Electricity";
import { ValidationError } from "errors/index";
import { canRequest } from "middlewares/can";
import { redis } from "models/cacheDatabase";
import nc, { type ApiRequest } from "models/connect";
import validator from "models/validator";
import type { NextApiResponse } from "next";
import type { RequestHandler } from "next-connect";
import { electricityRepository } from "repositories/index";

interface PostHandlerBody {
	year: number;
	month: number;
	peakConsumption: ElectricityBill["peakConsumption"];
	offpeakConsumption: ElectricityBill["offpeakConsumption"];
	totalPrice: number;
	items?: ElectricityBill["items"];
}

type PutHandlerBody = { id: string } & Partial<PostHandlerBody>;

const getHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Ler contas de energia

	// TODO: Add rate limiter

	const cachedBills = await redis.get("electricity");
	if (!cachedBills) {
		const bills = await electricityRepository.readAll();

		await redis.set("electricity", JSON.stringify(bills));
		await redis.expire("electricity", 60 * 3);

		return res.status(200).json({ message: "Faturas recuperadas com sucesso.", bills });
	}

	const bills: ElectricityBill[] = JSON.parse(cachedBills);
	const expireSeconds = await redis.ttl("electricity");

	return res
		.status(200)
		.json({ message: "Faturas recuperadas com sucesso (em cache).", bills, expireSeconds });
};

const postHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Cadastrar conta de energia
	const body = validator<PostHandlerBody>(req.body, {
		year: "required",
		month: "required",
		peakConsumption: "required",
		offpeakConsumption: "required",
		totalPrice: "required",
		items: "optional",
	});

	const billAlreadyExists = await electricityRepository.customQuery(ref =>
		ref.where("year", "==", body.year).where("month", "==", body.month)
	);
	if (billAlreadyExists.length > 0) {
		throw new ValidationError({
			message: "Uma fatura para este mês e ano já existe.",
			action: "Verifique os dados e tente novamente.",
			errorLocationCode: "API:ELECTRICITY:POST:BILL_ALREADY_EXISTS",
		});
	}

	await electricityRepository.create({
		year: body.year,
		month: body.month,
		peakConsumption: body.peakConsumption,
		offpeakConsumption: body.offpeakConsumption,
		totalPrice: body.totalPrice,
		items: body.items,
	});

	const cacheExists = await redis.exists("electricity");
	if (cacheExists) await redis.del("electricity");

	return res.status(201).json({ message: "Fatura cadastrada com sucesso." });
};

const putHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Atualizar conta de energia
	const { id, ...body } = validator<PutHandlerBody>(req.body, {
		id: "required",
		year: "optional",
		month: "optional",
		peakConsumption: "optional",
		offpeakConsumption: "optional",
		totalPrice: "optional",
		items: "optional",
	});

	await electricityRepository.update(id, { ...body });

	const cacheExists = await redis.exists("electricity");
	if (cacheExists) await redis.del("electricity");

	return res.status(200).json({ message: "Fatura alterada com sucesso." });
};

const deleteHandler: RequestHandler<ApiRequest, NextApiResponse> = async (req, res) => {
	// Deletar conta de energia
	const { id } = validator<{ id: string }>(req.body, { id: "required" });

	await electricityRepository.delete(id);

	const cacheExists = await redis.exists("electricity");
	if (cacheExists) await redis.del("electricity");

	return res.status(200).json({ message: "Fatura deletada com sucesso." });
};

export default nc()
	.get(getHandler)
	.post(canRequest("create:electricity_bill"), postHandler)
	.put(canRequest("update:electricity_bill"), putHandler)
	.delete(canRequest("update:electricity_bill"), deleteHandler);
