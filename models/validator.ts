import { ValidationError } from "errors/index";
import Joi from "joi";

export default function validator<ReturnType = any>(
	object: Object,
	keys: Record<string, "required" | "optional">
) {
	try {
		object = JSON.parse(JSON.stringify(object));
	} catch (err) {
		throw new ValidationError({
			message: "Não foi possível validar o objeto JSON.",
			action: "Tente novamente ou reporte o erro com 'requestId'.",
			errorLocationCode: "MODELS:VALIDATOR:JSON_PARSING",
		});
	}

	let validatedSchema = Joi.object<ReturnType>().required().min(1).messages({
		"object.base": "O Body enviado deve ser um objeto.",
		"object.min": "O Body enviado deve ter no mínimo uma chave.",
	});

	for (const key of Object.keys(keys)) {
		const keyValidator = schemas[key];
		validatedSchema = validatedSchema.concat(keyValidator());
	}

	const { error, value } = validatedSchema.validate(object, {
		stripUnknown: true,
		context: {
			required: keys,
		},
	});

	if (error) {
		throw new ValidationError({
			message: error.details[0].message,
			errorLocationCode: "MODELS:VALIDATOR:SCHEMA",
			key: error.details[0].context?.key || error.details[0].context?.type || "object",
			type: error.details[0].type,
		});
	}

	return value;
}

const schemas: Record<string, () => Joi.ObjectSchema> = {
	id: () => {
		return Joi.object({
			id: Joi.string()
				.trim()
				.guid({ version: "uuidv4" })
				.when("$required.id", {
					is: "required",
					then: Joi.required(),
					otherwise: Joi.optional(),
				})
				.messages({
					"any.required": "O campo 'id' é obrigatório.",
					"string.empty": "O campo 'id' não pode estar em branco.",
					"string.base": "O campo 'id' deve ser uma string",
					"string.guid": "O campo 'id' deve ser um UUIDv4.",
				}),
		});
	},

	username: () => {
		return Joi.object({
			username: Joi.string()
				.trim()
				.alphanum()
				.invalid(null)
				.min(3)
				.max(30)
				.when("$required.username", {
					is: "required",
					then: Joi.required(),
					otherwise: Joi.optional(),
				})
				.messages({
					"any.required": "O campo 'username' é obrigatório.",
					"any.invalid": "O campo 'username' não pode ser nulo.",
					"string.empty": "O campo 'username' não pode estar em branco.",
					"string.base": "O campo 'username' deve ser uma string.",
					"string.alphanum":
						"O campo 'username' deve conter apenas caracteres alfanuméricos.",
					"string.min": "O campo 'username' deve ter, no mínimo, {#limit} caracteres.",
					"string.max": "O campo 'username' deve ter, no máximo, {#limit} caracteres.",
				}),
		});
	},

	email: function () {
		return Joi.object({
			email: Joi.string()
				.trim()
				.lowercase()
				.email()
				.invalid(null)
				.min(7)
				.max(254)
				.when("$required.email", {
					is: "required",
					then: Joi.required(),
					otherwise: Joi.optional(),
				})
				.messages({
					"any.required": "O campo 'email' é obrigatório.",
					"any.invalid": "O campo 'email' não pode ser nulo.",
					"string.empty": "O campo 'email' não pode estar em branco.",
					"string.base": "O campo 'email' deve ser uma string.",
					"string.email": "O campo 'email' deve ser um email válido.",
				}),
		});
	},

	password: function () {
		return Joi.object({
			password: Joi.string()
				.min(8)
				.max(72)
				.trim()
				.invalid(null)
				.when("$required.password", {
					is: "required",
					then: Joi.required(),
					otherwise: Joi.optional(),
				})
				.messages({
					"any.required": "O campo 'password' é obrigatório.",
					"any.invalid": "O campo 'password' não pode ser nulo.",
					"string.empty": "O campo 'password' não pode estar em branco.",
					"string.base": "O campo 'password' deve ser uma string.",
					"string.min": "O campo 'password' deve ter, no mínimo, {#limit} caracteres.",
					"string.max": "O campo 'password' deve ter, no máximo, {#limit} caracteres.",
				}),
		});
	},
};
