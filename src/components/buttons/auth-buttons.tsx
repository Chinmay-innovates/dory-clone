import Link from "next/link";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

import {getUserInfo} from "@/lib/server/get-user-info";
import {cn, PropsWithClassName} from "@/lib/utils/ui-utils";
import routes from "@/config/routes";
import {UserAvatar} from "@/components/user-avatar";
import {PublicAuthButtons} from "./public-auth-buttons";
import {getUserNotifications} from "@/lib/server/get-user-notifications";
import {NotificationsMenu} from "@/components/menu/notifications-menu";

export const AuthButtons = async ({className}: PropsWithClassName) => {
    const kindeUser = await getKindeServerSession().getUser();
    const user = kindeUser && (await getUserInfo(kindeUser.id));

    const initialNotificatons = kindeUser && (await getUserNotifications())
    return user ? (
        <div className={cn("inline-flex gap-x-7 items-center", className)}>
            <NotificationsMenu
                className="size-5"
                initialNotifications={initialNotificatons ?? []}
            />
            <Link href={routes.dashboard}>
                <UserAvatar
                    displayName={user.displayName}
                    color={user.color}
                    className="ring-2 ring-white"
                />
            </Link>
        </div>
    ) : (
        <PublicAuthButtons className={className}/>
    );
};
