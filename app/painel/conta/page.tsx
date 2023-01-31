import React from "react";
import { MdAccountCircle } from "react-icons/md";
import { getSession } from "interface/hooks/getSession";
import { Module } from "./Module";

export default async function Page() {
	const { session } = await getSession({ redirect: "/login" });

	return (
		<main className="flex flex-col w-full gap-7 bg-white">
			<div className="flex items-center gap-3">
				<MdAccountCircle className="text-4xl" />
				<h1 className="text-3xl font-semibold">Sua conta</h1>
			</div>
			<Module
				title="Informações de usuário"
				subModules={[
					{
						name: "Nome completo",
						status: session?.fullname || "Não informado",
						action: {
							label: !!session?.fullname ? "Editar nome" : "Informar nome",
						},
					},
					{
						name: "Nome de usuário",
						status: session?.username || "Não informado",
						action: {
							label: "Editar usuário",
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
						},
					},
				]}
			/>
		</main>
	);
}
