import { getSession } from "interface/hooks/getSession";
import React from "react";
import {
	MdAccountCircle,
	MdPersonAddAlt1,
	MdManageAccounts,
	MdAccountBalance,
	MdDataSaverOff,
} from "react-icons/md";
import { SubModule } from "./SubModule";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
	await getSession({ redirect: "/login" });

	return (
		<>
			<section className="flex h-full">
				<aside className="flex flex-col w-72 p-4 gap-4 bg-gray-100">
					<SubModule name="Sua conta" href="/painel/conta">
						<MdAccountCircle className="text-xl" />
					</SubModule>
					<div className="flex flex-col gap-2">
						<h2 className="text-lg font-medium text-gray-500">Usuários</h2>
						<SubModule name="Convidar administrador" href="/painel/usuarios/convidar">
							<MdPersonAddAlt1 className="text-xl" />
						</SubModule>
						<SubModule name="Gerenciar usuários" href="/painel/usuarios">
							<MdManageAccounts className="text-xl" />
						</SubModule>
					</div>
					<div className="flex flex-col gap-2">
						<h2 className="text-lg font-medium text-gray-500">Energia</h2>
						<SubModule name="Concessionária" href="/painel/energia/concessionaria">
							<MdAccountBalance className="text-xl" />
						</SubModule>
						<SubModule name="Gerenciar dados" href="/painel/energia">
							<MdDataSaverOff className="text-xl" />
						</SubModule>
					</div>
					<div className="flex flex-col gap-2">
						<h2 className="text-lg font-medium text-gray-500">Água</h2>
						<SubModule name="Concessionária" href="/painel/agua/concessionaria">
							<MdAccountBalance className="text-xl" />
						</SubModule>
						<SubModule name="Gerenciar dados" href="/painel/agua">
							<MdDataSaverOff className="text-xl" />
						</SubModule>
					</div>
					<div className="flex flex-col gap-2">
						<h2 className="text-lg font-medium text-gray-500">Papel & Resíduos</h2>
						<SubModule name="Gerenciar dados" href="/painel/papeleresiduos">
							<MdDataSaverOff className="text-xl" />
						</SubModule>
					</div>
				</aside>
				<section className="flex flex-col w-full bg-white p-16">{children}</section>
			</section>
		</>
	);
}
