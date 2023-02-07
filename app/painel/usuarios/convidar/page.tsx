import React from "react";
import { MdPersonAddAlt1, MdWarning } from "react-icons/md";
import { Form } from "./Form";

export default async function Page() {
	return (
		<>
			<main className="flex flex-col w-full gap-7 bg-white">
				<div className="flex items-center gap-3">
					<div>
						<MdPersonAddAlt1 className="text-4xl" />
					</div>
					<h1 className="text-2xl lg:text-3xl font-semibold">Convidar administrador</h1>
				</div>
				<div className="flex items-center p-5 gap-4 bg-gray-100 rounded">
					<div>
						<MdWarning className="text-xl" />
					</div>
					<p className="text-sm lg:text-base">
						Insira o email do usuário que deseja tornar administrador. Este receberá uma
						notificação com um convite e poderá criar uma conta com ele. A partir deste
						momento, o usuário terá acesso a plataforma, mas não terá permissão para
						alterar todos os dados.
					</p>
				</div>
				<Form />
			</main>
		</>
	);
}
