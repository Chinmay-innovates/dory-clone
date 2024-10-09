
"use server";

import { z } from "zod";
import {actionClient} from "@/lib/actions/safe-action";
import {pollIdSchema} from "@/lib/schema-validations/poll-schemas";
import {eventPublicIdSchema} from "@/lib/schema-validations/event-schemas";
import {getEventClosedPolls} from "@/lib/server/get-event-closed-polls";

export const getEventClosedPollsAction = actionClient
    .schema(
        z
            .object({
                cursor: pollIdSchema.optional(),
                pollId: pollIdSchema.optional(),
            })
            .merge(eventPublicIdSchema)
    )
    .action(async ({ parsedInput: { cursor, ownerId, eventSlug, pollId } }) =>
        getEventClosedPolls({
            ownerId,
            eventSlug,
            cursor,
            ...(pollId ? { filters: { pollId } } : {}),
        })
    );
