import { PermissionsLabels } from "entities/Permissions";
import type { User } from "entities/User";
import dynamic from "next/dynamic";
import React, { type FC, memo } from "react";

const UserCardDialog = dynamic(() => import("./UserCardDialog").then(mod => mod.UserCardDialog), {
	ssr: false,
});

export const UserCard: FC<User> = memo(function Component({
	id,
	fullname,
	username,
	email,
	permissions,
}) {
	permissions = permissions.sort((a, b) => permissions.indexOf(b) - permissions.indexOf(a));

	return (
		<>
			<li className="flex flex-col lg:flex-row justify-between items-center gap-5 p-4 bg-gray-100 rounded-sm shadow-sm">
				<div className="flex flex-col gap-2 w-full">
					<div className="flex flex-col">
						<h3 className="font-medium truncate">
							{fullname || "Sem nome"} ({username})
						</h3>
						<h4 className="font-light truncate">Email: {email}</h4>
					</div>
					<div className="max-w-[90%] print:max-w-full">
						<h4 className="pb-1">Permissões:</h4>
						<ul className="flex flex-row gap-1 w-full overflow-x-auto">
							{permissions.map(permission => (
								<li
									key={permission}
									className="min-w-fit p-1 bg-gray-200 rounded-sm text-sm font-light italic"
								>
									{PermissionsLabels[permission]}
								</li>
							))}
						</ul>
					</div>
				</div>

				<UserCardDialog {...{ id, fullname, username, email, permissions }} />
			</li>
		</>
	);
});
