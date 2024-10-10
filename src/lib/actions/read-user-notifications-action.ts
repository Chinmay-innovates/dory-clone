"use server";

import {z} from "zod";
import {actionClient} from "@/lib/actions/safe-action";
import {notificationIdSchema} from "@/lib/schema-validations/notifification-schema";
import {getUserNotifications} from "@/lib/server/get-user-notifications";

export const getUserNotificationsAction = actionClient
    .schema(
        z.object({
            cursor: notificationIdSchema.optional(),
        })
    )
    .action(async ({parsedInput: {cursor}}) =>
        getUserNotifications({cursor})
    );
