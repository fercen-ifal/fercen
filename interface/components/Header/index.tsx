"use client";

import { Popover } from "@headlessui/react";

import { useSession } from "interface/hooks/useSession";
import { getURL } from "models/webserver";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import logo from "public/logo-horizontal.webp";
import React, { memo, useCallback } from "react";

export const Header = memo(function Component() {
	const pathname = usePathname();
	const router = useRouter();
	const { session } = useSession();

	const logoff = useCallback(() => {
		fetch(new URL("/api/sessions", getURL()), { method: "DELETE" });
		router.push("/login");
	}, [router]);

	return (
		<>
			<header className="flex flex-col fixed print:static w-full sm:flex-row justify-between items-center h-[150px] sm:h-[90px] pl-5 sm:pl-0 pr-5 pt-2 pb-2 bg-primary-main z-[1]">
				{pathname !== "/" ? (
					<Link href="/">
						<Image
							src={logo}
							alt="Logo da FERCEN"
							className="w-full max-w-xs"
							priority
						/>
					</Link>
				) : (
					<Image src={logo} alt="Logo da FERCEN" className="w-full max-w-xs" priority />
				)}

				{pathname?.startsWith("/painel") && session ? (
					<Popover className="relative">
						{({ open }) => (
							<>
								<Popover.Button
									className={`print:hidden outline-none ${
										open ? "underline" : "hover:underline"
									}`}
								>
									Logado como: <strong>{session.username}</strong>
								</Popover.Button>

								<Popover.Panel className="flex flex-col absolute w-full mt-2 p-2 gap-2 bg-white border border-black/10 rounded shadow-sm z-[2]">
									<button
										onClick={logoff}
										className="bg-red-400 text-white p-1 rounded-sm text-sm duration-200 hover:brightness-95"
									>
										Deseja fazer logoff?
									</button>
								</Popover.Panel>
							</>
						)}
					</Popover>
				) : (
					<Link
						href={
							session
								? "/painel/conta"
								: ["/login", "/cadastrar"].includes(String(pathname))
								? "/"
								: "/login"
						}
						className="h-fit text-center border border-primary-dark rounded px-2 py-1.5 cursor-pointer duration-200 hover:bg-slate-300/10 hover:brightness-95 print:hidden"
					>
						{session
							? "Ir ao painel"
							: ["/login", "/cadastrar"].includes(String(pathname))
							? "Voltar ao início"
							: "Acesso restrito"}
					</Link>
				)}

				<span className="hidden print:inline text-xs">
					Relatório gerado em {new Date().toLocaleDateString()}{" "}
					{session ? `por ${session.fullname || session.username} ` : ""}
					na plataforma FERCEN.
				</span>
			</header>
		</>
	);
});
