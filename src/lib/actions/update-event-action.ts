"use server";

import routes from "@/config/routes";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {revalidatePath} from "next/cache";
import {actionClient} from "@/lib/actions/safe-action";
import {updateEventSchema} from "@/lib/schema-validations/event-schemas";
import {prisma} from "@/lib/prisma/client";

export const updateEventAction = actionClient
    .schema(updateEventSchema)
    .action(async ({parsedInput: {eventId, shortDescription}}) => {
        const user = await getKindeServerSession().getUser();

        if (!user) {
            throw new Error("Not authenticated");
        }

        const event = await prisma.event.findUnique({
            where: {id: eventId},
            select: {
                ownerId: true,
                slug: true,
            },
        });

        if (!event) {
            throw new Error("Event not found!");
        }

        // check the permission
        if (event.ownerId !== user.id) {
            throw new Error("Not authorized!");
        }

        // proceed to update the event
        await prisma.event.update({
            where: {
                id: eventId,
            },
            data: {
                shortDescription,
            },
        });

        revalidatePath(
            routes.event({
                ownerId: event.ownerId,
                eventSlug: event.slug,
            })
        );
    });
