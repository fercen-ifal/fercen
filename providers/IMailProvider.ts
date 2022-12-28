export interface IMailProviderContext {
	from?: string;
	to: string;
	subject: string;
}

export interface IMailProviderSettings {
	template: string;
	variables?: Record<string, string>;
}

export interface IMailProvider {
	send(context: IMailProviderContext, settings: IMailProviderSettings): Promise<void>;
}
