"use client";

import { FormContainer } from "interface/components/FormContainer";
import { TextField } from "interface/components/TextField";
import { fetcher } from "interface/utils/fetcher";
import { getURL } from "models/webserver";
import Link from "next/link";
import React, { useCallback, useRef, useState, type FC, type FormEvent } from "react";
import { ImSpinner2 } from "react-icons/im";

export const Form: FC = () => {
	const usernameInputRef = useRef<HTMLInputElement>(null);
	const newPasswordInputRef = useRef<HTMLInputElement>(null);
	const recoveryCodeInputRef = useRef<HTMLInputElement>(null);

	const [hasCode, setHasCode] = useState(false);
	const [alertText, setAlertText] = useState("");
	const [successText, setSuccessText] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const onFormSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			setIsLoading(true);

			if (hasCode) {
				if (!recoveryCodeInputRef.current?.value || !newPasswordInputRef.current?.value) {
					setAlertText("Preencha os campos.");
					setIsLoading(false);
					return;
				}

				const { error } = await fetcher(
					new URL("/api/user/recover", getURL()),
					{
						recoveryCode: recoveryCodeInputRef.current.value,
						newPassword: newPasswordInputRef.current.value,
					},
					{ method: "PUT" }
				);

				if (error) {
					console.error(error);
					setAlertText(
						`${error.message || "Não foi possível alterar sua senha."} ${
							error.action || "Tente novamente."
						}`
					);
					setIsLoading(false);
					return;
				}

				setSuccessText("Senha alterada com sucesso.");
				setIsLoading(false);
				return;
			}

			// if hasCode === false

			if (!usernameInputRef.current?.value) {
				setAlertText("Preencha os campos.");
				setIsLoading(false);
				return;
			}

			const { error } = await fetcher(new URL("/api/user/recover", getURL()), {
				username: usernameInputRef.current.value,
			});

			if (error) {
				console.error(error);
				setAlertText(
					`${error.message || "Não foi possível pedir a recuperação de senha."} ${
						error.action || "Tente novamente."
					}`
				);
				setIsLoading(false);
				return;
			}

			setHasCode(true);
			setIsLoading(false);
		},
		[hasCode]
	);

	const changeToHasCode = useCallback(() => {
		setHasCode(true);
	}, []);

	return (
		<>
			<FormContainer title="Recupere sua senha">
				<form onSubmit={onFormSubmit} className="flex flex-col gap-3">
					<div className="flex flex-col gap-4">
						{hasCode ? (
							<>
								<TextField
									id="recoveryCode"
									name="recoveryCode"
									spellCheck={false}
									placeholder="Código de recuperação:"
									ref={recoveryCodeInputRef}
								/>
								<TextField
									name="newPassword"
									spellCheck={false}
									type="password"
									placeholder="Nova senha:"
									ref={newPasswordInputRef}
								/>
							</>
						) : (
							<TextField
								id="username"
								name="username"
								spellCheck={false}
								placeholder="Usuário:"
								ref={usernameInputRef}
							/>
						)}
					</div>
					<div className="flex justify-between w-full text-xs text-primary-dark">
						{!hasCode ? (
							<button type="button" onClick={changeToHasCode}>
								Já possui um código de recuperação?
							</button>
						) : null}
						<Link href="/login">Voltar para o login</Link>
					</div>

					{successText ? (
						<span className="text-sm text-alt-blue">{successText}</span>
					) : alertText ? (
						<span className="text-sm text-alt-red">{alertText}</span>
					) : null}

					<button
						type="submit"
						className="flex justify-center items-center gap-3 bg-primary-dark text-white px-2 py-1.5 rounded-sm outline-primary-darker duration-200 hover:brightness-95 active:brightness-90 disabled:brightness-75 disabled:cursor-not-allowed"
					>
						{isLoading ? <ImSpinner2 className="text-lg animate-spin" /> : null}
						{hasCode ? "Alterar senha" : "Pedir código de recuperação"}
					</button>
				</form>
				<div className="flex flex-col mt-4">
					<span className="text-sm">
						Faça o pedido de um código de recuperação que o usuário informado receberá
						no email. Informe o código ao sistema e crie uma nova senha.
					</span>
				</div>
			</FormContainer>
		</>
	);
};
