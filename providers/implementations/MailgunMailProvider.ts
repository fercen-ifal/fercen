import type {
	IMailProvider,
	IMailProviderContext,
	IMailProviderSettings,
} from "providers/IMailProvider";
import retry from "async-retry";
import { domain, mailing } from "models/mail";
import { InternalServerError } from "errors/index";

export class MailgunMailProvider implements IMailProvider {
	private readonly retryOpts: retry.Options;

	constructor() {
		this.retryOpts = { retries: 3, minTimeout: 100, maxTimeout: 200 };
	}

	async send(context: IMailProviderContext, settings: IMailProviderSettings): Promise<void> {
		return await retry(async () => {
			try {
				await mailing.messages.create(domain, {
					from: `${context.from || "FERCEN"} <postmaster@${domain}>`,
					to: context.to,
					subject: context.subject,
					template: settings.template || "",
					"h:X-Mailgun-Variables": JSON.stringify(settings.variables),
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
