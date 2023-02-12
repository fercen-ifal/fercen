import { Form } from "./Form";

export default async function Page() {
	return (
		<main className="flex flex-col lg:flex-row justify-between 2xl:justify-center items-center h-full px-10 lg:px-20 pt-[calc(150px+8rem)] sm:pt-[calc(90px+8rem)] gap-10 lg:gap-32 2xl:gap-52 bg-primary-main">
			<section className="flex flex-col h-full">
				<h1 className="font-semibold text-3xl sm:text-5xl sm:leading-normal mb-2">
					Recuperação de senha perdida:
				</h1>
				<h2 className="sm:text-xl sm:leading-normal">
					Informe seu usuário e faça um pedido de recuperação <br /> de senha.
				</h2>
			</section>
			<Form />
		</main>
	);
}
