import { getSession } from "interface/hooks/getSession";
import type { Metadata } from "next";

import { Form } from "./Form";

export const metadata: Metadata = {
	title: "Faça login",
	description: "Faça login na sua conta FERCEN.",

	openGraph: {
		title: "Faça login | FERCEN",
		description: "Faça login na sua conta FERCEN.",
	},
};

export default async function Page() {
	await getSession({ redirect: "/painel/conta", redirectIfFound: true });

	return (
		<main className="flex flex-col lg:flex-row justify-between 2xl:justify-center items-center h-full px-10 lg:px-20 pt-[calc(150px+8rem)] sm:pt-[calc(90px+8rem)] gap-10 lg:gap-32 2xl:gap-52 bg-primary-main">
			<section className="flex flex-col h-full">
				<h1 className="font-semibold text-3xl sm:text-5xl sm:leading-normal mb-2">
					Acesse o sistema de <br /> administração:
				</h1>
				<h2 className="sm:text-xl sm:leading-normal">
					Utilize suas credenciais para acessar o sistema <br /> de administração da
					Ferramenta de Controle Energético.
				</h2>
			</section>
			<Form />
		</main>
	);
}
