"use client";

import { useSession } from "interface/hooks/useSession";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "public/logo-horizontal.webp";
import React, { memo } from "react";

export const Header = memo(function Component() {
	const pathname = usePathname();
	const { session } = useSession();

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
					<span className="print:hidden">
						Logado como: <strong>{session.username}</strong>
					</span>
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
