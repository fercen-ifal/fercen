"use client";

import { Button } from "interface/components/Button";
import { FormContainer } from "interface/components/FormContainer";
import { TextField } from "interface/components/TextField";
import { fetcher } from "interface/utils/fetcher";
import { getURL } from "models/webserver";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState, type FC, type FormEvent } from "react";

export const Form: FC = () => {
	const router = useRouter();
	const params = useSearchParams();

	const usernameInputRef = useRef<HTMLInputElement>(null);
	const emailInputRef = useRef<HTMLInputElement>(null);
	const passwordInputRef = useRef<HTMLInputElement>(null);
	const inviteInputRef = useRef<HTMLInputElement>(null);

	const [alertText, setAlertText] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const onFormSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			setIsLoading(true);

			if (
				!usernameInputRef.current?.value ||
				!emailInputRef.current?.value ||
				!passwordInputRef.current?.value ||
				!inviteInputRef.current?.value
			) {
				setAlertText("Preencha os campos.");
				setIsLoading(false);
				return;
			}

			const { error } = await fetcher(new URL("/api/users", getURL()), {
				username: usernameInputRef.current.value,
				email: emailInputRef.current.value,
				password: passwordInputRef.current.value,
				invite: inviteInputRef.current.value,
			});

			if (error) {
				console.error(error);
				setAlertText(
					`${error.message || "Não foi possível criar seu usuário."} ${
						error.action || "Tente novamente."
					}`
				);
				setIsLoading(false);
				return;
			}

			setIsLoading(false);
			return router.push("/login");
		},
		[router]
	);

	useEffect(() => {
		if (params.has("invite") && inviteInputRef.current) {
			inviteInputRef.current.value = String(params.get("invite"));
		}
	}, [params]);

	return (
		<>
			<FormContainer title="Crie seu usuário">
				<form onSubmit={onFormSubmit} className="flex flex-col gap-3">
					<div className="flex flex-col gap-4">
						<TextField
							name="username"
							spellCheck={false}
							placeholder="Usuário:"
							ref={usernameInputRef}
						/>
						<TextField
							name="email"
							spellCheck={false}
							type="email"
							placeholder="Email:"
							ref={emailInputRef}
						/>
						<TextField
							name="password"
							spellCheck={false}
							type="password"
							placeholder="Senha:"
							ref={passwordInputRef}
						/>
						<TextField
							name="invite"
							spellCheck={false}
							placeholder="Seu convite:"
							ref={inviteInputRef}
						/>
					</div>
					<div className="flex justify-between w-full text-xs text-primary-dark">
						<Link href="/login">Já possui uma conta?</Link>
					</div>
					{alertText ? <span className="text-sm text-alt-red">{alertText}</span> : null}
					<Button type="submit" className="bg-primary-dark" loading={isLoading}>
						Cadastrar
					</Button>
				</form>
				<div className="flex flex-col mt-4">
					<span className="text-sm">
						No campo “Seu convite” insira o código que foi destinado ao seu usuário para
						seu registro ser permitido.
					</span>
				</div>
			</FormContainer>
		</>
	);
};
