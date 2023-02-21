"use client";

import React, { type FC, memo, useCallback, useEffect } from "react";
import { MdMenu } from "react-icons/md";
import { useBoolean } from "react-use";

export const MobileMenu: FC = memo(function Component() {
	const [isMenuOpen, toggleMenu] = useBoolean(false);

	useEffect(() => {
		const content = document.getElementById("content");
		if (!content) return;

		const outsideClickHandler = () => {
			toggleMenu(false);
		};

		content.addEventListener("mousedown", outsideClickHandler);
		content.addEventListener("touchstart", outsideClickHandler);

		return () => {
			content.removeEventListener("mousedown", outsideClickHandler);
			content.removeEventListener("touchstart", outsideClickHandler);
		};
	}, [toggleMenu]);

	useEffect(() => {
		const menu = document.getElementById("menu");
		if (!menu) return;

		if (isMenuOpen) {
			menu.classList.remove("scale-0");
			menu.classList.add("scale-100");
		} else {
			menu.classList.remove("scale-100");
			menu.classList.add("scale-0");
		}
	}, [isMenuOpen]);

	const onClick = useCallback(() => {
		toggleMenu();
	}, [toggleMenu]);

	return (
		<>
			<button
				type="button"
				aria-labelledby="menuButtonLabel"
				className="sm:hidden fixed left-4 top-4 p-1 z-[2] bg-white rounded shadow print:hidden"
				onClick={onClick}
			>
				<span id="menuButtonLabel" className="sr-only">
					Botão que abre e fecha o menu de páginas.
				</span>
				<MdMenu className="text-3xl text-black" />
			</button>
		</>
	);
});
