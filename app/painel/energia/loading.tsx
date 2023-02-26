import React from "react";
import { ImSpinner2 } from "react-icons/im";
import { MdDataSaverOff } from "react-icons/md";

export default function Loading() {
	return (
		<>
			<main className="flex flex-col w-full gap-7 bg-white">
				<div className="flex items-center gap-3">
					<div>
						<MdDataSaverOff className="text-4xl" />
					</div>
					<h1 className="text-2xl lg:text-3xl font-semibold">
						Gerenciar dados de energia
					</h1>
				</div>
				<div className="flex items-center p-5 gap-4 bg-gray-100 rounded">
					<ImSpinner2 className="text-lg animate-spin" />
					<p className="text-sm lg:text-base">Carregando...</p>
				</div>
			</main>
		</>
	);
}
