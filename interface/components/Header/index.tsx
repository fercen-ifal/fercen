"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { memo } from "react";
import { useSession } from "interface/hooks/useSession";

import logo from "public/logo-horizontal.webp";

export const Header = memo(function Component() {
	const pathname = usePathname();
	const { session } = useSession();

	return (
		<>
			<header className="flex flex-col sm:flex-row justify-center sm:justify-between items-center px-2 sm:px-4 py-4 sm:py-2 bg-primary-main">
				{pathname !== "/" ? (
					<Link href="/">
						<Image src={logo} alt="Logo da FERCEN" className="w-full max-w-xs" />
					</Link>
				) : (
					<Image src={logo} alt="Logo da FERCEN" className="w-full max-w-xs" />
				)}

				{pathname === "/conta" && session ? (
					<span>
						Logado como: <strong>{session.username}</strong>
					</span>
				) : (
					<Link
						href={
							session
								? "/conta"
								: ["/login", "/cadastrar"].includes(String(pathname))
								? "/"
								: "/login"
						}
						className="h-fit border border-primary-dark rounded-sm px-2 py-1.5 cursor-pointer duration-200 hover:bg-slate-300/10 hover:brightness-95"
					>
						{session
							? "Ir ao painel"
							: ["/login", "/cadastrar"].includes(String(pathname))
							? "Voltar ao início"
							: "Acesso restrito"}
					</Link>
				)}
			</header>
		</>
	);
});
