"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
	RegisterLink,
	useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import routes from "@/app/config/routes";
import { cn } from "@/lib/utils";

const btnClasses = cn(
	buttonVariants(),
	"p-6 text-sm rounded-sm lg:p-8 lg:text-xl py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
);
export const GetStartedButton = () => {
	const { isAuthenticated } = useKindeBrowserClient();
	if (!isAuthenticated) {
		return <RegisterLink className={btnClasses}>Get Started 👉</RegisterLink>;
	}
	return (
		<Link href={routes.dashboard} className={btnClasses}>
			Get Started 👉
		</Link>
	);
};
