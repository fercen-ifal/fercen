"use client";

import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import React, { type FC, memo, useRef } from "react";
import { BufferGeometry, Color, Material, Mesh, TextureLoader } from "three";

const GlobeAnimation: FC<{
	mesh: React.MutableRefObject<Mesh<BufferGeometry, Material | Material[]>>;
	animate?: boolean;
}> = ({ mesh, animate = true }) => {
	useFrame(() => {
		if (!animate) return;

		mesh.current.rotation.x += Math.random() * (0.008 - 0.002) + 0.002;
		mesh.current.rotation.y += Math.random() * (0.005 - 0.0035) + 0.0035;
	});

	return <></>;
};

export const Globe = memo(function Component() {
	const meshRef = useRef<Mesh<BufferGeometry, Material | Material[]>>(null!);

	const [earthTexture, earthBumpMap, earthSpecMap] = useLoader(TextureLoader, [
		"/materials/earth.jpg",
		"/materials/earth-bump.jpg",
		"/materials/earth-spec.jpg",
	]);
	const earthSpec = new Color("grey");

	return (
		<>
			<Canvas
				shadows
				camera={{
					position: [0, 0, 3],
				}}
				className="!w-[350px] !h-[350px]"
			>
				<GlobeAnimation mesh={meshRef} />
				<perspectiveCamera />
				<ambientLight intensity={1.1} />
				<directionalLight position={[-2, 2, 2]} intensity={0.2} />

				<mesh ref={meshRef} position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.4}>
					<sphereGeometry args={[1, 32, 32]} />
					<meshPhongMaterial
						map={earthTexture}
						bumpMap={earthBumpMap}
						specularMap={earthSpecMap}
						specular={earthSpec}
					/>
				</mesh>
			</Canvas>
		</>
	);
});
