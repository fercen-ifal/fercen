import React, { use } from "react";
import { getSession } from "interface/hooks/getSession";

export default function Page() {
	const session = use(getSession());

	return (
		<div>
			<h1>Homepage</h1>
			<p>{JSON.stringify({ ...session })}</p>
		</div>
	);
}
