import type {
	IMailProvider,
	IMailProviderContext,
	IMailProviderSettings,
} from "providers/IMailProvider";
import retry from "async-retry";
import mailing from "models/mail";
import { InternalServerError } from "errors/index";

/**
 * Classe que implementa o provedor de emails da Sendgrid.
 *
 * @class SendgridMailProvider
 * @typedef {SendgridMailProvider}
 * @implements {IMailProvider}
 */
export class SendgridMailProvider implements IMailProvider {
	private readonly retryOpts: retry.Options;

	constructor() {
		this.retryOpts = { retries: 3, minTimeout: 100, maxTimeout: 200 };
	}

	async send(context: IMailProviderContext, settings: IMailProviderSettings): Promise<void> {
		return await retry(async () => {
			try {
				await mailing.send({
					to: context.to,
					from: context.from || "Equipe FERCEN <jpnm1@aluno.ifal.edu.br>",
					subject: context.subject,
					templateId: settings.template,
					dynamicTemplateData: {
						subject: context.subject,
						...settings.variables,
					},
				});
			} catch (err) {
				throw new InternalServerError({
					message: "Não foi possível enviar um email.",
					errorLocationCode: "PROVIDERS:MAIL:SEND_FAILURE",
				});
			}
		}, this.retryOpts);
	}
}
