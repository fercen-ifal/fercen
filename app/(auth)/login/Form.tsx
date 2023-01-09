"use client";

import { FormContainer } from "interface/components/FormContainer";
import { TextField } from "interface/components/TextField";
import { fetcher } from "interface/utils/fetcher";
import { getURL } from "models/webserver";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useRef, useState, type FC, type FormEvent } from "react";

export const Form: FC = () => {
	const router = useRouter();
	const usernameInputRef = useRef<HTMLInputElement>(null);
	const passwordInputRef = useRef<HTMLInputElement>(null);
	const [alertText, setAlertText] = useState("");

	const onFormSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			if (!usernameInputRef.current?.value || !passwordInputRef.current?.value) {
				setAlertText("Preencha os campos.");
				return;
			}

			const { error } = await fetcher(new URL("/api/sessions", getURL()), {
				username: usernameInputRef.current.value,
				password: passwordInputRef.current.value,
			});

			if (error) {
				console.error(error);
				setAlertText(`${error.message} ${error.action}`);
				return;
			}

			// TODO: Update path according to actual page
			return router.push("/conta");
		},
		[router]
	);

	return (
		<>
			<FormContainer title="Faça login">
				<form onSubmit={onFormSubmit} className="flex flex-col gap-3">
					<div className="flex flex-col gap-4">
						<TextField
							name="username"
							spellCheck={false}
							placeholder="Usuário:"
							ref={usernameInputRef}
						/>
						<TextField
							name="password"
							spellCheck={false}
							type="password"
							placeholder="Senha:"
							ref={passwordInputRef}
						/>
					</div>
					<div className="flex justify-between w-full text-xs text-primary-dark">
						<Link href="/cadastrar">Criar um novo usuário</Link>
						<Link href="/recuperar/senha">Esqueceu sua senha?</Link>
					</div>
					{alertText ? <span className="text-sm text-alt-red">{alertText}</span> : null}
					{/* // TODO: Add loading animation and block while loading */}
					<button
						type="submit"
						className="bg-primary-dark text-white px-2 py-1.5 rounded-sm outline-primary-darker duration-200 hover:brightness-95 active:brightness-90"
					>
						Entrar
					</button>
				</form>
				<div className="flex flex-col gap-4 mt-4">
					<span className="text-sm">
						Se você sincronizou sua conta com Google e/ou Microsoft, pode utilizar algum
						agora para fazer login de forma mais rápida.
					</span>
					<div className="flex flex-col sm:flex-row justify-between gap-3">
						{/* //TODO: Add google icon */}
						<button className="w-full px-2 py-1.5 bg-alt-red text-white rounded-sm duration-200 hover:brightness-95 active:brightness-90">
							Entre com Google
						</button>
						{/* // TODO: Add microsoft icon */}
						<button className="w-full px-2 py-1.5 bg-alt-blue text-white rounded-sm duration-200 hover:brightness-95 active:brightness-90">
							Entre com Microsoft
						</button>
					</div>
				</div>
			</FormContainer>
		</>
	);
};
