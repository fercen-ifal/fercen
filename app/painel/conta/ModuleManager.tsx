"use client";

import { Dialog } from "@headlessui/react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import type { UserSession } from "entities/Session";
import { Button } from "interface/components/Button";
import { TextField } from "interface/components/TextField";
import { fetcher } from "interface/utils/fetcher";
import { getURL } from "models/webserver";
import { useRouter } from "next/navigation";
import React, { memo, type FC, useState, useRef, useCallback, type FormEvent } from "react";
import { ImSpinner2 } from "react-icons/im";
import { MdClose } from "react-icons/md";
import { useBoolean } from "react-use";
import { Module } from "./Module";

export interface ModuleManagerProps {
	session?: UserSession;
}

interface DialogProps {
	close: () => void;
}

const FullnameEditDialog: FC<DialogProps> = ({ close }) => {
	const fullnameInputRef = useRef<HTMLInputElement>(null);
	const passwordInputRef = useRef<HTMLInputElement>(null);
	const [alertText, setAlertText] = useState("");
	const [isLoading, toggleLoading] = useBoolean(false);
	const router = useRouter();

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
};

const UsernameEditDialog: FC<DialogProps> = ({ close }) => {
	const usernameInputRef = useRef<HTMLInputElement>(null);
	const passwordInputRef = useRef<HTMLInputElement>(null);
	const [alertText, setAlertText] = useState("");
	const [isLoading, toggleLoading] = useBoolean(false);
	const router = useRouter();

	const onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			toggleLoading();

			if (!usernameInputRef.current?.value || !passwordInputRef.current?.value) {
				setAlertText("Preencha os campos.");
				toggleLoading();
				return;
			}

			const { error } = await fetcher(
				new URL("/api/user", getURL()),
				{
					username: usernameInputRef.current.value,
					password: passwordInputRef.current.value,
				},
				{ method: "PUT" }
			);

			if (error) {
				setAlertText(
					`${error.message || "Não foi possível editar seu usuário."} ${
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
				<Dialog.Title className="text-xl font-medium">Editar usuário</Dialog.Title>
				<MdClose role="button" className="text-3xl p-1" onClick={close} />
			</div>
			<form onSubmit={onSubmit} className="flex flex-col gap-3">
				<TextField
					name="username"
					placeholder="Seu nome de usuário:"
					ref={usernameInputRef}
				/>
				<TextField
					name="password"
					spellCheck={false}
					type="password"
					placeholder="Senha:"
					ref={passwordInputRef}
				/>
				{alertText ? <span className="text-sm text-alt-red">{alertText}</span> : null}
				<button
					type="submit"
					className="flex justify-center items-center gap-3 bg-primary-dark text-white px-2 py-1.5 rounded-sm outline-primary-darker duration-200 hover:brightness-95 active:brightness-90 disabled:brightness-75 disabled:cursor-not-allowed"
					disabled={isLoading}
				>
					{isLoading ? <ImSpinner2 className="text-lg animate-spin" /> : null}
					Salvar
				</button>
			</form>
		</>
	);
};

const PasswordEditDialog: FC<DialogProps> = ({ close }) => {
	const newPasswordInputRef = useRef<HTMLInputElement>(null);
	const passwordInputRef = useRef<HTMLInputElement>(null);
	const [alertText, setAlertText] = useState("");
	const [isLoading, toggleLoading] = useBoolean(false);
	const router = useRouter();

	const onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			toggleLoading();

			if (!newPasswordInputRef.current?.value || !passwordInputRef.current?.value) {
				setAlertText("Preencha os campos.");
				toggleLoading();
				return;
			}

			const { error } = await fetcher(
				new URL("/api/user", getURL()),
				{
					newPassword: newPasswordInputRef.current.value,
					password: passwordInputRef.current.value,
				},
				{ method: "PUT" }
			);

			if (error) {
				setAlertText(
					`${error.message || "Não foi possível alterar sua senha."} ${
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
				<Dialog.Title className="text-xl font-medium">Alterar senha</Dialog.Title>
				<MdClose role="button" className="text-3xl p-1" onClick={close} />
			</div>
			<form onSubmit={onSubmit} className="flex flex-col gap-3">
				<TextField
					name="newPassword"
					spellCheck={false}
					type="password"
					placeholder="Sua nova senha:"
					ref={newPasswordInputRef}
				/>
				<TextField
					name="password"
					spellCheck={false}
					type="password"
					placeholder="Senha:"
					ref={passwordInputRef}
				/>
				{alertText ? <span className="text-sm text-alt-red">{alertText}</span> : null}
				<button
					type="submit"
					className="flex justify-center items-center gap-3 bg-primary-dark text-white px-2 py-1.5 rounded-sm outline-primary-darker duration-200 hover:brightness-95 active:brightness-90 disabled:brightness-75 disabled:cursor-not-allowed"
					disabled={isLoading}
				>
					{isLoading ? <ImSpinner2 className="text-lg animate-spin" /> : null}
					Alterar
				</button>
			</form>
		</>
	);
};

// TODO: Optimize this file

const ModuleManagerWithoutProvider: FC<ModuleManagerProps> = memo(function Component({ session }) {
	const [isDialogOpen, toggleDialog] = useBoolean(false);
	const [dialog, setDialog] = useState<string | null>(null);

	const syncGoogleAccount = useGoogleLogin({
		onSuccess: async ({ access_token }) => {
			const { error } = await fetcher(
				new URL("/api/sessions/google", getURL()),
				{
					code: access_token,
				},
				{ method: "PUT" }
			);

			if (error) {
				console.log(
					`${error.message || "Não foi possível sincronizar sua conta Google."} ${
						error.action || "Tente novamente."
					}`
				);
				return;
			}

			console.log("Conta Google sincronizada.");
		},
	});

	const desyncGoogleAccount = async () => {
		const { error } = await fetcher(new URL("/api/sessions/google", getURL()), undefined, {
			method: "DELETE",
		});

		if (error) {
			console.log(
				`${error.message || "Não foi possível remover vínculo Google."} ${
					error.action || "Tente novamente."
				}`
			);
			return;
		}

		console.log("Conta Google desvinculada com sucesso.");
	};

	return (
		<>
			<Dialog
				open={isDialogOpen}
				onClose={toggleDialog}
				className="flex justify-center items-center absolute h-[calc(100vh+11%)] px-4 inset-0 z-10 bg-black/10 backdrop-blur-sm"
			>
				<Dialog.Panel className="flex flex-col w-full max-w-lg gap-4 p-5 rounded bg-white">
					{dialog === "fullname" ? (
						<FullnameEditDialog close={toggleDialog} />
					) : dialog === "username" ? (
						<UsernameEditDialog close={toggleDialog} />
					) : dialog === "password" ? (
						<PasswordEditDialog close={toggleDialog} />
					) : null}
				</Dialog.Panel>
			</Dialog>

			<Module
				title="Informações de usuário"
				subModules={[
					{
						name: "Nome completo",
						status: session?.fullname || "Não informado",
						action: {
							label: !!session?.fullname ? "Editar nome" : "Informar nome",
							onClick: () => {
								toggleDialog();
								setDialog("fullname");
							},
						},
					},
					{
						name: "Nome de usuário",
						status: session?.username || "Não informado",
						action: {
							label: "Editar usuário",
							onClick: () => {
								toggleDialog();
								setDialog("username");
							},
						},
					},
					{
						name: "Email",
						status: session?.email || "Não informado",
					},
				]}
			/>
			<Module
				title="Login & Segurança"
				subModules={[
					{
						name: "Conta Google",
						status: !!session?.googleProvider ? "Vinculada" : "Não vinculada",
						action: {
							label: !!session?.googleProvider ? "Remover vínculo" : "Vincular",
							onClick: !!session?.googleProvider
								? desyncGoogleAccount
								: syncGoogleAccount,
						},
					},
					{
						name: "Conta Microsoft",
						status: !!session?.microsoftProvider ? "Vinculada" : "Não vinculada",
						action: {
							label: !!session?.microsoftProvider ? "Remover vínculo" : "Vincular",
						},
					},
					{
						name: "Senha",
						status: "",
						action: {
							label: "Alterar senha",
							onClick: () => {
								toggleDialog();
								setDialog("password");
							},
						},
					},
				]}
			/>
		</>
	);
});

export const ModuleManager: FC<ModuleManagerProps> = ({ session }) => {
	return (
		<>
			<GoogleOAuthProvider clientId={String(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID)}>
				<ModuleManagerWithoutProvider session={session} />
			</GoogleOAuthProvider>
		</>
	);
};
