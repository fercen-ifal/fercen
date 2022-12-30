import { ValidationError } from "errors/index";
import Joi from "joi";

/**
 * Valida o objeto passado em relação as `keys` informadas.
 *
 * @param {Object} object Objeto que será validado.
 * @param {(Record<string, "required" | "optional">)} keys Keys do objeto que
 * devem ser validadas, podendo ser obrigatórias ou opcionais, e qualquer key
 * informada que não estiver neste objeto será ignorada.
 *
 * @returns {ReturnType} Objeto validado do tipo `ReturnType`.
 */
export default function validator<ReturnType = any>(
	object: Object,
	keys: Record<string, "required" | "optional">
): ReturnType {
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
					"any.required": "O campo {#label} é obrigatório.",
					"string.empty": "O campo {#label} não pode estar em branco.",
					"string.base": "O campo {#label} deve ser uma string",
					"string.guid": "O campo {#label} deve ser um UUIDv4.",
				}),
		});
	},

	fullname: () => {
		return Joi.object({
			fullname: Joi.string()
				.trim()
				.invalid(null)
				.regex(/[a-zA-Z\u00C0-\u017F´\s][^_,;:/|\\*&¨%$#@!(){[}\]=+<>\d]{0,}/)
				.min(5)
				.max(50)
				.when("$required.fullname", {
					is: "required",
					then: Joi.required(),
					otherwise: Joi.optional(),
				})
				.messages({
					"any.required": "O campo {#label} é obrigatório.",
					"any.invalid": "O campo {#label} não pode ser nulo.",
					"string.empty": "O campo {#label} não pode estar em branco.",
					"string.base": "O campo {#label} deve ser uma string.",
					"string.min": "O campo {#label} deve ter, no mínimo, {#limit} caracteres.",
					"string.max": "O campo {#label} deve ter, no máximo, {#limit} caracteres.",
					"string.pattern.base":
						"O campo {#label} deve ter apenas letras ou caracteres para nomes.",
				}),
		});
	},

	username: () => {
		return Joi.object({
			username: Joi.string()
				.trim()
				.lowercase()
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
					"any.required": "O campo {#label} é obrigatório.",
					"any.invalid": "O campo {#label} não pode ser nulo.",
					"string.empty": "O campo {#label} não pode estar em branco.",
					"string.base": "O campo {#label} deve ser uma string.",
					"string.alphanum":
						"O campo {#label} deve conter apenas caracteres alfanuméricos.",
					"string.min": "O campo {#label} deve ter, no mínimo, {#limit} caracteres.",
					"string.max": "O campo {#label} deve ter, no máximo, {#limit} caracteres.",
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
					"any.required": "O campo {#label} é obrigatório.",
					"any.invalid": "O campo {#label} não pode ser nulo.",
					"string.empty": "O campo {#label} não pode estar em branco.",
					"string.base": "O campo {#label} deve ser uma string.",
					"string.email": "O campo {#label} deve ser um email válido.",
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
					"any.required": "O campo {#label} é obrigatório.",
					"any.invalid": "O campo {#label} não pode ser nulo.",
					"string.empty": "O campo {#label} não pode estar em branco.",
					"string.base": "O campo {#label} deve ser uma string.",
					"string.min": "O campo {#label} deve ter, no mínimo, {#limit} caracteres.",
					"string.max": "O campo {#label} deve ter, no máximo, {#limit} caracteres.",
				}),
		});
	},

	newPassword: function () {
		return Joi.object({
			newPassword: Joi.string()
				.min(8)
				.max(72)
				.trim()
				.invalid(null)
				.when("$required.newPassword", {
					is: "required",
					then: Joi.required(),
					otherwise: Joi.optional(),
				})
				.messages({
					"any.required": "O campo {#label} é obrigatório.",
					"any.invalid": "O campo {#label} não pode ser nulo.",
					"string.empty": "O campo {#label} não pode estar em branco.",
					"string.base": "O campo {#label} deve ser uma string.",
					"string.min": "O campo {#label} deve ter, no mínimo, {#limit} caracteres.",
					"string.max": "O campo {#label} deve ter, no máximo, {#limit} caracteres.",
				}),
		});
	},

	invite: () => {
		return Joi.object({
			invite: Joi.string()
				.trim()
				.regex(/[A-Za-z0-9_-]{7,7}/)
				.invalid(null)
				.min(7)
				.max(7)
				.when("$required.invite", {
					is: "required",
					then: Joi.required(),
					otherwise: Joi.optional(),
				})
				.messages({
					"any.required": "O campo {#label} é obrigatório.",
					"any.invalid": "O campo {#label} não pode ser nulo.",
					"string.empty": "O campo {#label} não pode estar em branco.",
					"string.base": "O campo {#label} deve ser uma string.",
					"string.min": "O campo {#label} deve ter, no mínimo, {#limit} caracteres.",
					"string.max": "O campo {#label} deve ter, no máximo, {#limit} caracteres.",
					"string.pattern.base":
						"O campo {#label} deve ter apenas letras, números e alguns símbolos especiais.",
				}),
		});
	},

	recoveryCode: () => {
		return Joi.object({
			recoveryCode: Joi.string()
				.trim()
				.regex(/[A-Za-z0-9_-]{8,8}/)
				.invalid(null)
				.min(8)
				.max(8)
				.when("$required.recoveryCode", {
					is: "required",
					then: Joi.required(),
					otherwise: Joi.optional(),
				})
				.messages({
					"any.required": "O campo {#label} é obrigatório.",
					"any.invalid": "O campo {#label} não pode ser nulo.",
					"string.empty": "O campo {#label} não pode estar em branco.",
					"string.base": "O campo {#label} deve ser uma string.",
					"string.min": "O campo {#label} deve ter, no mínimo, {#limit} caracteres.",
					"string.max": "O campo {#label} deve ter, no máximo, {#limit} caracteres.",
					"string.pattern.base":
						"O campo {#label} deve ter apenas letras, números e alguns símbolos especiais.",
				}),
		});
	},
};
