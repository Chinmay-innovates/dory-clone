"use client";

import { cn } from "@/lib/utils/ui-utils";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import { baseUrl } from "@/app/config/routes";

export const PublicAuthButtons = ({ className }: PropsWithClassName) => {
	const pathname = usePathname();
	return (
		<div className={cn("inline-flex gap-x-3 items-center", className)}>
			<LoginLink
				postLoginRedirectURL={`${baseUrl}${pathname}`}
				className={cn(
					buttonVariants({ variant: "secondary" }),
					"text-sm rounded-full"
				)}
			>
				Sign In
			</LoginLink>
			<RegisterLink
				postLoginRedirectURL={`${baseUrl}${pathname}`}
				className={cn(
					buttonVariants({ variant: "default" }),
					"text-sm rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400/80 transition duration-200"
				)}
			>
				Sign Up
			</RegisterLink>
		</div>
	);
};
