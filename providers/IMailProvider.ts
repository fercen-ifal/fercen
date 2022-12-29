/** Interface do contexto do email. */
export interface IMailProviderContext {
	from?: string;
	to: string;
	subject: string;
}

/** Interface das configurações do email.  */
export interface IMailProviderSettings {
	template: string;
	variables?: Record<string, string>;
}

/** Interface do provedor de emails.  */
export interface IMailProvider {
	/**
	 * Envia um email baseado nas informações passadas.
	 *
	 * @param {IMailProviderContext} context Contexto do email.
	 * @param {IMailProviderSettings} settings Configurações do email.
	 *
	 * @returns {Promise<void>} Promessa do envio.
	 */
	send(context: IMailProviderContext, settings: IMailProviderSettings): Promise<void>;
}
