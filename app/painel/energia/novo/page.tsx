import Link from "next/link";
import React from "react";
import { MdDataSaverOff, MdArrowBack } from "react-icons/md";

import { Form } from "./Form";

// TODO: Fix pathname, menu options and submodule highlighting

export default async function Page() {
	return (
		<>
			<main className="flex flex-col w-full gap-7 bg-white">
				<div className="flex justify-between items-center gap-5">
					<div className="flex items-center gap-3">
						<div>
							<MdDataSaverOff className="text-4xl" />
						</div>
						<h1 className="text-2xl lg:text-3xl font-semibold">
							Cadastrar nova fatura de energia
						</h1>
					</div>
					<div className="flex items-center">
						<Link
							href="/painel/energia"
							aria-label="Botão para voltar ao menu anterior"
							className="p-1 rounded-sm bg-gray-100 duration-200 hover:brightness-95"
						>
							<MdArrowBack className="text-3xl" />
						</Link>
					</div>
				</div>
				<Form />
			</main>
		</>
	);
}
