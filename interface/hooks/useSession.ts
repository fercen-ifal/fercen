"use client";

import { useEffect } from "react";
import useSWR, { type KeyedMutator } from "swr";
import type { UserSession } from "entities/Session";
import { useRouter } from "next/navigation";

interface SessionsApiData {
	message: string;
	session?: UserSession;
}

export interface UseSessionReturn {
	session?: UserSession;
	mutate: KeyedMutator<SessionsApiData>;
	isLoading: boolean;
	error?: any;
}

export const useSession = (
	redirect?: string | URL,
	redirectIfFound?: boolean
): UseSessionReturn => {
	const { push } = useRouter();
	const { data, mutate, isLoading, error } = useSWR<SessionsApiData>("/api/sessions");
	const session = data?.session;

	useEffect(() => {
		if (isLoading) return;
		if (
			(redirect && !redirectIfFound && !session) ||
			(redirect && redirectIfFound && session)
		) {
			push(typeof redirect === "string" ? redirect : redirect.toString());
		}
	}, [isLoading, session, redirect, redirectIfFound, push, data, error]);

	return { session, mutate, isLoading, error };
};