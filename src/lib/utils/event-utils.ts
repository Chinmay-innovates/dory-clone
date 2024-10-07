import {Event} from "@prisma/client";
import routes, {baseUrl} from "@/app/config/routes";

type Params = {
    ownerId: Event["ownerId"];
    eventSlug: Event["slug"];
};

export const getEventLink = ({ownerId, eventSlug}: Params) => {
    return `${baseUrl}${routes.event({
        ownerId,
        eventSlug,
    })}`;
};