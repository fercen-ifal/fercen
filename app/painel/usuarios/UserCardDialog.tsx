"use client";

import { Dialog, Popover } from "@headlessui/react";

import {
	type Permission,
	Permissions,
	PermissionsLabels,
	AnonymousUserPermissions,
} from "entities/Permissions";
import { Button } from "interface/components/Button";
import { TextField } from "interface/components/TextField";
import { fetcher } from "interface/utils/fetcher";
import { getURL } from "models/webserver";
import { useRouter } from "next/navigation";
import React, { type FC, memo, useState, useCallback, useRef, type FormEvent } from "react";
import { MdClose, MdDelete, MdAdd, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import { useBoolean } from "react-use";

export interface SubModuleProps {
	id: string;
	fullname: string | null;
	username: string;
	email: string;
	permissions: Permission[];
}

export const UserCardDialog: FC<SubModuleProps> = memo(function Component({
	id,
	fullname,
	username,
	email,
	permissions,
}) {
	const router = useRouter();
	const [isDialogOpen, toggleDialog] = useBoolean(false);
	const [isLoading, toggleLoading] = useBoolean(false);
	const [permissionsSet, setPermissionsSet] = useState(permissions);

	const fullnameInputRef = useRef<HTMLInputElement>(null);
	const emailInputRef = useRef<HTMLInputElement>(null);

	const closeDialog = useCallback(() => {
		toggleDialog(false);
		setPermissionsSet(permissions);
	}, [toggleDialog, permissions]);

	const onSubmit = useCallback(
		async (event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const fullname = fullnameInputRef.current?.value || "";
			const email = emailInputRef.current?.value || "";

			const { error } = await fetcher(
				new URL("/api/user", getURL()),
				{
					id,
					fullname: fullname.length > 0 ? fullname : undefined,
					email: email.length > 0 ? email : undefined,
					permissions: permissionsSet,
				},
				{ method: "PATCH" }
			);

			if (error) {
				console.error(error);
				toast.error(error.message || "Não foi possível editar o usuário.");

				toggleLoading(false);
				return;
			}

			toast.success("Usuário editado com sucesso.");
			router.refresh();
		},
		[id, permissionsSet, toggleLoading, router]
	);

	return (
		<>
			<Button
				onClick={() => toggleDialog()}
				className="bg-gray-500 text-white text-sm print:hidden"
			>
				<MdEdit className="text-lg" />
				Editar
			</Button>

			<Dialog
				open={isDialogOpen}
				onClose={closeDialog}
				className="flex justify-center items-center absolute h-screen px-4 inset-0 z-10 bg-black/10 backdrop-blur-sm"
			>
				<Dialog.Panel className="flex flex-col w-full max-w-lg gap-4 p-5 rounded bg-white">
					<div className="flex justify-between px-1">
						<Dialog.Title className="text-xl font-medium">
							Editar usuário ({username})
						</Dialog.Title>
						<MdClose role="button" className="text-3xl p-1" onClick={closeDialog} />
					</div>
					<form onSubmit={onSubmit} className="flex flex-col gap-4">
						<span className="text-xs">
							Tome cuidado ao alterar permissões, pois algumas são vitais para o
							funcionamento correto da plataforma.
						</span>
						<div className="flex flex-col gap-2">
							<TextField
								ref={fullnameInputRef}
								name="fullname"
								type="text"
								placeholder={
									fullname ? `Nome completo: ${fullname}` : "Nome completo:"
								}
							/>
							<TextField
								ref={emailInputRef}
								name="email"
								type="email"
								placeholder={email ? `Email: ${email}` : "Email:"}
							/>
							<ul className="flex flex-col flex-wrap max-h-36 overflow-auto gap-1 my-1">
								{permissionsSet.map(permission => (
									<li
										key={permission}
										className="flex flex-row items-center gap-2 px-1 w-fit rounded-sm border border-primary-main/70"
									>
										<button
											type="button"
											onClick={() =>
												setPermissionsSet(oldSet =>
													oldSet.filter(value => value !== permission)
												)
											}
										>
											<MdDelete className="text-lg" />
										</button>
										<span className="text-sm">
											{PermissionsLabels[permission]}
										</span>
									</li>
								))}
								<Popover>
									<Popover.Button className="flex flex-row items-center gap-2 px-1.5 w-fit rounded-sm bg-primary-main">
										<MdAdd className="text-lg" />
										<span className="text-sm">Adicionar permissão</span>
									</Popover.Button>

									<Popover.Panel className="flex flex-col w-48 absolute mt-2 p-2 gap-1 bg-white border border-black/10 rounded shadow-sm z-[11]">
										{Object.keys(Permissions)
											.filter(
												value =>
													!permissionsSet.includes(value as Permission) &&
													!AnonymousUserPermissions.includes(
														value as "create:user" | "create:session"
													)
											)
											.map(permission => (
												<button
													key={permission}
													type="button"
													onClick={() =>
														setPermissionsSet(oldSet => [
															...oldSet,
															permission as Permission,
														])
													}
													className="text-sm py-1 bg-white duration-200 hover:brightness-95"
												>
													{PermissionsLabels[permission as Permission]}
												</button>
											))}
									</Popover.Panel>
								</Popover>
							</ul>
							<Button className="bg-primary-dark" loading={isLoading}>
								Salvar
							</Button>
						</div>
					</form>
				</Dialog.Panel>
			</Dialog>
		</>
	);
});
