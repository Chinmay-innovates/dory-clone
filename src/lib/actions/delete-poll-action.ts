"use server";

import routes from "@/config/routes";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {revalidatePath} from "next/cache";
import {actionClient} from "@/lib/actions/safe-action";
import {getPollSchema} from "@/lib/schema-validations/poll-schemas";
import {prisma} from "@/lib/prisma/client";

export const deletePollAction = actionClient
    .schema(getPollSchema)
    .action(async ({parsedInput: {pollId}}) => {
        const user = await getKindeServerSession().getUser();

        if (!user) {
            throw new Error("Not authenticated");
        }

        const poll = await prisma.poll.findUnique({
            where: {id: pollId},
            select: {
                event: {
                    select: {
                        ownerId: true,
                        slug: true,
                    },
                },
            },
        });

        if (!poll) {
            throw new Error("Poll not found!");
        }

        // check the permission
        if (poll.event.ownerId !== user.id) {
            throw new Error("You do not have the permission for deleting this poll");
        }

        // delete the poll
        await prisma.poll.delete({
            where: {
                id: pollId,
            },
        });

        revalidatePath(
            routes.eventPolls({
                eventSlug: poll.event.slug,
                ownerId: poll.event.ownerId,
            })
        );
    });
