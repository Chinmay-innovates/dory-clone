"use server";


import {z} from "zod";
import {actionClient} from "@/lib/actions/safe-action";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {prisma} from "@/lib/prisma/client";
import {notificationIdSchema} from "@/lib/schema-validations/notifification-schema";

export const readNotificationAction = actionClient
    .schema(
        z.object({
            notificationId: notificationIdSchema,
        })
    )
    .action(async ({parsedInput: {notificationId}}) => {
        const user = await getKindeServerSession().getUser();

        if (!user) {
            throw new Error("Not authenticated");
        }

        await prisma.notification.update({
            where: {
                id: notificationId,
                AND: {
                    userId: user.id,
                },
            },
            data: {
                read: true,
            },
        });
    });
