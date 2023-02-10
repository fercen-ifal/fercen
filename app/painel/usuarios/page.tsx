import { TextField } from "interface/components/TextField";
import React from "react";
import { MdManageAccounts, MdSearch, MdWarning } from "react-icons/md";
import { fetcher } from "interface/utils/fetcher";
import { getURL } from "models/webserver";
import type { User } from "entities/User";
import { cookies } from "next/headers";
import { UserCard } from "./UserCard";

async function getUsers() {
	const NEXT_CACHE_LIFETIME = 10;

	const cookie = cookies().get("fercen-session");

	const res = await fetcher<{ users: User[] }>(new URL("/api/users", getURL()), undefined, {
		next: { revalidate: NEXT_CACHE_LIFETIME },
		credentials: "same-origin",
		headers: {
			cookie: `${cookie?.name}=${cookie?.value}`,
		},
	});

	if (res.error) {
		throw new Error(`${res.error.message} ${res.error.action}`);
	}
	return res.data.users;
}

export default async function Page() {
	const users = await getUsers();

	return (
		<>
			<main className="flex flex-col w-full gap-7 bg-white">
				<div className="flex items-center gap-3">
					<div>
						<MdManageAccounts className="text-4xl" />
					</div>
					<h1 className="text-2xl lg:text-3xl font-semibold">Gerenciar usuários</h1>
				</div>
				<div className="flex flex-row items-center gap-2 w-full">
					<div className="w-full">
						<TextField
							name="search"
							type="search"
							placeholder="Procure usuários (nome, usuário ou email):"
						/>
					</div>
					<div>
						<MdSearch className="text-xl" />
					</div>
				</div>
				<section className="h-full max-h-full overflow-y-auto">
					{!users || users.length <= 0 ? (
						<div className="flex justify-center items-center gap-4 p-2 bg-gray-100 rounded">
							<MdWarning />
							<p className="text-center">O servidor não retornou nenhum usuário.</p>
						</div>
					) : (
						<ul className="flex flex-col gap-4 max-w-full">
							{users
								.sort((a, b) => b.permissions.length - a.permissions.length)
								.map(user => (
									<UserCard key={user.id} {...user} />
								))}
						</ul>
					)}
				</section>
			</main>
		</>
	);
}
