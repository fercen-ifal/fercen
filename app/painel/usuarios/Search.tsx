"use client";

import type { User } from "entities/User";
import Fuse from "fuse.js";
import { TextField } from "interface/components/TextField";
import React, {
	type FC,
	memo,
	useMemo,
	useState,
	useEffect,
	useCallback,
	type ChangeEvent,
} from "react";
import { MdSearch } from "react-icons/md";
import { UserCard } from "./UserCard";

export interface SearchProps {
	data: User[];
}

export const Search: FC<SearchProps> = memo(function Component({ data }) {
	const fuse = useMemo(() => {
		return new Fuse(data, {
			keys: [
				"fullname",
				"username",
				"email",
				"googleProvider.email",
				"microsoftProvider.email",
			],
			useExtendedSearch: true,
			threshold: 0.6,
			isCaseSensitive: false,
		});
	}, [data]);

	const [search, setSearch] = useState("");
	const [results, setResults] = useState(fuse.search(search));

	useEffect(() => {
		const newResults = fuse.search(search);
		setResults(newResults);
	}, [fuse, search]);

	const onSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
	}, []);

	return (
		<>
			<div className="flex flex-row items-center gap-2 w-full">
				<div className="w-full">
					<TextField
						name="search"
						type="search"
						placeholder="Procure usuários (nome, usuário ou email):"
						value={search}
						onChange={onSearchChange}
					/>
				</div>
				<div>
					<MdSearch className="text-xl" />
				</div>
			</div>
			{results.length >= 1 || search.length >= 1 ? (
				<div className="flex flex-col gap-4 py-2 border-t border-b">
					<p className="text-sm italic pt-1">Resultados da busca ({results.length}):</p>
					<ul className="flex flex-col gap-2">
						{results.map(result => (
							<UserCard key={result.item.id} {...result.item} />
						))}
					</ul>
					<p className="text-xs italic">Fim da busca</p>
				</div>
			) : null}
		</>
	);
});
