"use server";

import {z} from "zod";
import {actionClient} from "@/lib/actions/safe-action";
import {eventIdSchema} from "@/lib/schema-validations/event-schemas";
import {getUserEvents} from "@/lib/server/get-user-events";

export const getUserEventsAction = actionClient
    .schema(z.object({cursor: eventIdSchema.optional()}))
    .action(async ({parsedInput: {cursor}}) => getUserEvents({cursor}));
