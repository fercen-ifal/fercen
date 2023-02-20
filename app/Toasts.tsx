"use client";

import React, { type FC, memo } from "react";
import { ToastContainer } from "react-toastify";

export const Toasts: FC = memo(function Component() {
	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				closeOnClick
				pauseOnHover
				draggable
			/>
		</>
	);
});
