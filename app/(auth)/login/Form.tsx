"use client";

import { FormContainer } from "interface/components/FormContainer";
import { TextField } from "interface/components/TextField";
import { fetcher } from "interface/utils/fetcher";
import { getURL } from "models/webserver";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useRef, useState, type FC, type FormEvent } from "react";
import { ImGoogle } from "react-icons/im";
import { BsMicrosoft } from "react-icons/bs";
import { Button } from "interface/components/Button";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

const FormWithoutProvider: FC = () => {
	const router = useRouter();
	const usernameInputRef = useRef<HTMLInputElement>(null);
	const passwordInputRef = useRef<HTMLInputElement>(null);

	const [alertText, setAlertText] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const loginWithGoogle = useGoogleLogin({
		onSuccess: async ({ access_token }) => {
			setIsLoading(true);
			setAlertText("");

			const { error } = await fetcher(new URL("/api/sessions/google", getURL()), {
				code: access_token,
			});

			if (error) {
				setAlertText(
					`${error.message || "Não foi possível fazer login com Google."} ${
						error.action || "Tente novamente."
					}`
				);
				setIsLoading(false);
				return;
			}

			setIsLoading(false);
			router.push("/painel/conta");
		},
	});

	const onFormSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			setIsLoading(true);
			setAlertText("");

			if (!usernameInputRef.current?.value || !passwordInputRef.current?.value) {
				setAlertText("Preencha os campos.");
				setIsLoading(false);
				return;
			}

			const { error } = await fetcher(new URL("/api/sessions", getURL()), {
				username: usernameInputRef.current.value,
				password: passwordInputRef.current.value,
			});

			if (error) {
				setAlertText(
					`${error.message || "Não foi possível fazer login."} ${
						error.action || "Tente novamente."
					}`
				);
				setIsLoading(false);
				return;
			}

			setIsLoading(false);
			return router.push("/painel/conta");
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
					<div className="flex justify-between w-full gap-3 text-xs text-primary-dark">
						<Link href="/cadastrar">Criar um novo usuário</Link>
						<Link href="/recuperar/senha">Esqueceu sua senha?</Link>
					</div>
					{alertText ? <span className="text-sm text-alt-red">{alertText}</span> : null}
					<Button type="submit" className="bg-primary-dark" loading={isLoading}>
						Entrar
					</Button>
				</form>
				<div className="flex flex-col gap-4 mt-4">
					<span className="text-sm">
						Se você sincronizou sua conta com Google e/ou Microsoft, pode utilizar algum
						agora para fazer login de forma mais rápida.
					</span>
					<div className="flex flex-col sm:flex-row justify-between gap-3">
						<Button
							type="button"
							className="w-full bg-alt-red"
							onClick={() => loginWithGoogle()}
							loading={isLoading}
						>
							<ImGoogle />
							Entre com Google
						</Button>
						<Button type="button" className="w-full bg-alt-blue" loading={isLoading}>
							<BsMicrosoft />
							Entre com Microsoft
						</Button>
					</div>
				</div>
			</FormContainer>
		</>
	);
};

export const Form: FC = () => {
	return (
		<>
			<GoogleOAuthProvider clientId={String(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)}>
				<FormWithoutProvider />
			</GoogleOAuthProvider>
		</>
	);
};
