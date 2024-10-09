import "server-only";
import {Event, User} from "@prisma/client";
import {cache} from "react";
import {prisma} from "@/lib/prisma/client";
import {pollDetail} from "@/lib/prisma/validators/poll-validators";

type Params = {
    ownerId: User["id"];
    eventSlug: Event["slug"];
};

export const getEventLivePolls = cache(
    async ({eventSlug, ownerId}: Params) => {
        return prisma.poll.findMany({
            where: {
                event: {
                    ownerId,
                    slug: eventSlug,
                },
                isLive: true,
            },
            ...pollDetail,
            orderBy: {
                createdAt: "desc",
            },
        });
    }
);
