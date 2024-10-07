import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { cn } from "@/lib/utils/ui-utils";
import { getUserInfo } from "@/lib/server/get-user-info";
import { PropsWithClassName } from "@/lib/utils/ui-utils";

import { Bell } from "lucide-react";
import routes from "@/config/routes";
import { UserAvatar } from "@/components/user-avatar";
import { PublicAuthButtons } from "./public-auth-buttons";

export const AuthButtons = async ({ className }: PropsWithClassName) => {
	const kindeUser = await getKindeServerSession().getUser();
	const user = kindeUser && (await getUserInfo(kindeUser.id));
	return user ? (
		<div className={cn("inline-flex gap-x-7 items-center", className)}>
			<Bell className="size-5" />
			<Link href={routes.dashboard}>
				<UserAvatar
					displayName={user.displayName}
					color={user.color}
					className="ring-2 ring-white"
				/>
			</Link>
		</div>
	) : (
		<PublicAuthButtons className={className} />
	);
};
