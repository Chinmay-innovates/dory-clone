"use server";

import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {z} from "zod";
import {actionClient} from "@/lib/actions/safe-action";
import {eventIdSchema} from "@/lib/schema-validations/event-schemas";
import {prisma} from "@/lib/prisma/client";

export const bookmarkEventAction = actionClient
    .schema(z.object({eventId: eventIdSchema}))
    .action(async ({parsedInput: {eventId}}) => {
        const user = await getKindeServerSession().getUser();

        if (!user) {
            throw new Error("Not authenticated");
        }

        const eventWithBookmarks = await prisma.event.findUnique({
            where: {id: eventId},
            select: {
                bookmarkedBy: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!eventWithBookmarks) {
            throw new Error("Event not found!");
        }

        const wasBookmarkedByUser = eventWithBookmarks.bookmarkedBy.some(
            (bookmarkedUser) => bookmarkedUser.id === user.id
        );

        if (wasBookmarkedByUser) {
            // remove the bookmark
            await prisma.event.update({
                where: {id: eventId},
                data: {
                    bookmarkedBy: {
                        disconnect: {
                            id: user.id,
                        },
                    },
                },
            });
        } else {
            // bookmark the event for the user
            await prisma.event.update({
                where: {id: eventId},
                data: {
                    bookmarkedBy: {
                        connect: {
                            id: user.id,
                        },
                    },
                },
            });
        }
    });
