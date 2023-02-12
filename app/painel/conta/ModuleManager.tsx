"use client";

import { Dialog } from "@headlessui/react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import type { UserSession } from "entities/Session";
import { fetcher } from "interface/utils/fetcher";
import { getURL } from "models/webserver";
import React, { memo, type FC, useState } from "react";
import { useBoolean } from "react-use";
import { EmailDialog } from "./dialogs/EmailDialog";
import { FullnameDialog } from "./dialogs/FullnameDialog";
import { PasswordDialog } from "./dialogs/PasswordDialog";
import { Module } from "./Module";

export interface ModuleManagerProps {
	session?: UserSession;
}

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
						<FullnameDialog close={toggleDialog} />
					) : dialog === "email" ? (
						<EmailDialog close={toggleDialog} />
					) : dialog === "password" ? (
						<PasswordDialog close={toggleDialog} />
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
					},
					{
						name: "Email",
						status: session?.email || "Não informado",
						action: {
							label: "Editar email",
							onClick: () => {
								toggleDialog();
								setDialog("email");
							},
						},
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
