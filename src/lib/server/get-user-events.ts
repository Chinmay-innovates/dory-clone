import "server-only"

import {cache} from "react"

import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

import {prisma} from "@/lib/prisma/client"
import {Event} from "@prisma/client"

import {eventDetail} from "@/lib/prisma/validators/event-validators";

type  Params = {
    cursor?: Event["id"];
}

export const getUserEvents = cache(async ({cursor}: Params = {}) => {
    const user = await getKindeServerSession().getUser();

    if (!user || !user.id) {
        throw new Error("Unauthenticated");
    }

    return prisma.event.findMany({
        where: {
            ownerId: user.id,
        },
        ...eventDetail,
        take: 20,
        skip: cursor ? 1 : 0,
        ...(cursor ? {cursor: {id: cursor}} : {}),
        orderBy: {
            createdAt: "desc",
        },
    });
})