
"use server";

import { z } from "zod";
import {actionClient} from "@/lib/actions/safe-action";
import {eventIdSchema} from "@/lib/schema-validations/event-schemas";
import {getUserBookmarkedEvents} from "@/lib/server/get-user-bookmarked-events";

export const getUserBookmarkedEventsAction = actionClient
    .schema(z.object({ cursor: eventIdSchema.optional() }))
    .action(async ({ parsedInput: { cursor } }) =>
        getUserBookmarkedEvents({ cursor })
    );
