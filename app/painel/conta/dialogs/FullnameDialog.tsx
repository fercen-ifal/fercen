"use client";

import { Dialog } from "@headlessui/react";
import { Button } from "interface/components/Button";
import { TextField } from "interface/components/TextField";
import { fetcher } from "interface/utils/fetcher";
import { getURL } from "models/webserver";
import { useRouter } from "next/navigation";
import { type FC, useRef, useState, useCallback, type FormEvent, memo } from "react";
import { MdClose } from "react-icons/md";
import { useBoolean } from "react-use";
import type { DialogProps } from ".";

export const FullnameDialog: FC<DialogProps> = memo(function Component({ close }) {
	const router = useRouter();

	const fullnameInputRef = useRef<HTMLInputElement>(null);
	const passwordInputRef = useRef<HTMLInputElement>(null);

	const [alertText, setAlertText] = useState("");
	const [isLoading, toggleLoading] = useBoolean(false);

	const onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			toggleLoading();

			if (!fullnameInputRef.current?.value || !passwordInputRef.current?.value) {
				setAlertText("Preencha os campos.");
				toggleLoading();
				return;
			}

			const { error } = await fetcher(
				new URL("/api/user", getURL()),
				{
					fullname: fullnameInputRef.current.value,
					password: passwordInputRef.current.value,
				},
				{ method: "PUT" }
			);

			if (error) {
				setAlertText(
					`${error.message || "Não foi possível editar seu nome."} ${
						error.action || "Tente novamente."
					}`
				);
				toggleLoading();
				return;
			}

			toggleLoading();
			close();
			router.refresh();
		},
		[toggleLoading, close, router]
	);

	return (
		<>
			<div className="flex justify-between px-1">
				<Dialog.Title className="text-xl font-medium">Editar nome</Dialog.Title>
				<MdClose role="button" className="text-3xl p-1" onClick={close} />
			</div>
			<form onSubmit={onSubmit} className="flex flex-col gap-3">
				<TextField
					name="fullname"
					placeholder="Seu nome completo:"
					ref={fullnameInputRef}
				/>
				<TextField
					name="password"
					spellCheck={false}
					type="password"
					placeholder="Senha:"
					ref={passwordInputRef}
				/>
				{alertText ? <span className="text-sm text-alt-red">{alertText}</span> : null}
				<Button type="submit" className="bg-primary-dark" loading={isLoading}>
					Salvar
				</Button>
			</form>
		</>
	);
});
