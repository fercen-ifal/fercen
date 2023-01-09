// import { getSession } from "interface/hooks/getSession";
import { Form } from "./Form";

export default async function Page() {
	// TODO: Remove comment when initial phase ends
	// TODO: Update path according to actual page
	/* await getSession({ redirect: "/conta", redirectIfFound: true }); */

	return (
		<main className="flex flex-col lg:flex-row justify-between 2xl:justify-center items-center h-full px-10 lg:px-20 pt-32 gap-10 lg:gap-32 2xl:gap-52 bg-primary-main">
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
