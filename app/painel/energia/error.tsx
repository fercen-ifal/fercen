"use client";

import { Button } from "interface/components/Button";
import React from "react";
import { MdDataSaverOff, MdWarning } from "react-icons/md";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
	return (
		<main className="flex flex-col w-full gap-7 bg-white">
			<div className="flex items-center gap-3">
				<div>
					<MdDataSaverOff className="text-4xl" />
				</div>
				<h1 className="text-2xl lg:text-3xl font-semibold">Gerenciar dados de energia</h1>
			</div>
			<div className="flex justify-center items-center gap-4 p-2 bg-red-400 rounded-sm">
				<div>
					<MdWarning className="text-lg" />
				</div>
				<p className="text-center">{error.message}</p>
			</div>
			<Button className="bg-gray-500" onClick={reset}>
				Clique aqui para tentar novamente
			</Button>
		</main>
	);
}
