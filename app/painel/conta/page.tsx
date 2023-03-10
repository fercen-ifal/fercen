import { getSession } from "interface/hooks/getSession";
import type { Metadata } from "next";
import React from "react";
import { MdAccountCircle } from "react-icons/md";

import { ModuleManager } from "./ModuleManager";

export const metadata: Metadata = {
	title: "Sua Conta",
	description: "Gerencie os dados da sua conta FERCEN.",

	openGraph: {
		title: "Sua Conta | FERCEN",
		description: "Gerencie os dados da sua conta FERCEN.",
	},
};

export default async function Page() {
	const { session } = await getSession({ redirect: "/login" });

	return (
		<>
			<main className="flex flex-col w-full gap-7 bg-white">
				<div className="flex items-center gap-3">
					<div>
						<MdAccountCircle className="text-4xl" />
					</div>
					<h1 className="text-2xl lg:text-3xl font-semibold">Sua conta</h1>
				</div>
				<ModuleManager session={session} />
			</main>
		</>
	);
}
