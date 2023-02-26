import { getElectricityBills } from "interface/hooks/getElectricityBills";
import Link from "next/link";
import React from "react";
import { MdDataSaverOff, MdWarning, MdAdd } from "react-icons/md";

import { ElectricityBills } from "./ElectricityBills";

export default async function Page() {
	const bills = await getElectricityBills();

	return (
		<>
			<main className="flex flex-col w-full gap-7 bg-white">
				<div className="flex justify-between items-center gap-5">
					<div className="flex items-center gap-3">
						<div>
							<MdDataSaverOff className="text-4xl" />
						</div>
						<h1 className="text-2xl lg:text-3xl font-semibold">
							Gerenciar dados de energia
						</h1>
					</div>
					<div className="flex items-center">
						<Link
							href="/painel/energia/novo"
							aria-label="Botão para criar nova conta de energia"
							className="p-1 rounded-sm bg-gray-100 duration-200 hover:brightness-95"
						>
							<MdAdd className="text-3xl" />
						</Link>
					</div>
				</div>

				{!bills || bills.length <= 0 ? (
					<div className="flex justify-center items-center gap-4 p-2 bg-gray-100 rounded">
						<MdWarning />
						<p className="text-center">
							O servidor não retornou nenhuma conta de energia.
						</p>
					</div>
				) : (
					<>
						<div className="flex items-center p-4 gap-4 bg-gray-100 rounded">
							<div>
								<MdWarning className="text-xl" />
							</div>
							<p className="text-sm lg:text-base">
								Pode-se notar um atraso de até <strong>2 minutos</strong> para a
								atualização dos dados após uma alteração. Tempos de espera maiores
								que este indicam instabilidade no servidor.
							</p>
						</div>
						<ElectricityBills bills={bills} />
					</>
				)}
			</main>
		</>
	);
}
