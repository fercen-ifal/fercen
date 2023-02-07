"use client";

import { TextField } from "interface/components/TextField";
import { fetcher } from "interface/utils/fetcher";
import { getURL } from "models/webserver";
import React, { useCallback, useRef, useState, type FC, type FormEvent } from "react";
import { Button } from "interface/components/Button";

export const Form: FC = () => {
	const emailInputRef = useRef<HTMLInputElement>(null);

	const [alertText, setAlertText] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const onFormSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsLoading(true);
		setAlertText("");

		if (!emailInputRef.current?.value) {
			setAlertText("Preencha o campo.");
			setIsLoading(false);
			return;
		}

		const { error } = await fetcher(
			new URL("/api/invites", getURL()),
			{
				email: emailInputRef.current.value,
			},
			{ method: "POST" }
		);

		if (error) {
			setAlertText(
				`${error.message || "Não foi possível criar o convite."} ${
					error.action || "Tente novamente."
				}`
			);
			setIsLoading(false);
			return;
		}

		setIsLoading(false);
	}, []);

	return (
		<>
			<div className="flex flex-col gap-2">
				<form onSubmit={onFormSubmit} className="flex flex-col lg:flex-row gap-4">
					<div className="w-full">
						<TextField
							name="email"
							type="email"
							placeholder="Email do usuário:"
							ref={emailInputRef}
						/>
					</div>
					<Button type="submit" className="bg-primary-dark" loading={isLoading}>
						Enviar
					</Button>
				</form>
				{alertText ? <span className="pl-2 text-sm text-alt-red">{alertText}</span> : null}
			</div>
		</>
	);
};
