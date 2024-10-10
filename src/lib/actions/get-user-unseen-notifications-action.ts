"use server";

import {actionClient} from "@/lib/actions/safe-action";
import {getUserNotifications} from "@/lib/server/get-user-notifications";

export const getUserUnseenNotificationsAction = actionClient.action(async () =>
    getUserNotifications({unseenOnly: true})
);
