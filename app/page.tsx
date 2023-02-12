import Link from "next/link";
import React from "react";
import { Globe } from "./Globe";

export default function Page() {
	return (
		<div className="static sm:relative sm:flex-grow h-full">
			<div className="static sm:absolute inset-0 h-full">
				<main className="flex flex-col justify-between items-center h-full px-10 pt-[150px] sm:pt-[90px] gap-10">
					<section className="flex flex-col lg:flex-row lg:px-10 pt-20 lg:pt-32 gap-2 lg:gap-40">
						<div className="flex flex-col justify-center">
							<h1 className="font-semibold text-5xl leading-normal mb-2">
								Nossa energia não pode <br /> ir para o{" "}
								<span className="text-primary-darker">lixo.</span>
							</h1>
							<h2 className="text-xl leading-normal">
								Valorizamos a transparência, acesse os dados de consumo <br />{" "}
								energético da Instituição Federal de Alagoas.
							</h2>
						</div>
						<div className="flex justify-center items-center">
							<Globe />
						</div>
					</section>
					<section className="flex flex-col lg:flex-row justify-between items-center gap-10 w-full lg:h-52 p-14 bg-white shadow-md rounded-tl-[30px] rounded-tr-[30px]">
						<h2 className="font-semibold text-3xl leading-normal">
							Esta ferramenta torna público os dados de <br /> consumo de energia do
							IFAL, consulte agora:
						</h2>
						<div className="flex flex-col gap-2">
							<Link
								href="/dados"
								className="rounded-sm px-6 py-1 bg-primary-dark text-white text-xl text-center"
							>
								Veja os dados
							</Link>
							<Link
								href="mailto:jpnm1@aluno.ifal.edu.br?subject=(FERCEN) Digite aqui o assunto"
								className="rounded-sm px-6 py-1 bg-gray-500 text-white text-xl text-center"
							>
								Fale conosco
							</Link>
						</div>
					</section>
				</main>
			</div>
		</div>
	);
}
