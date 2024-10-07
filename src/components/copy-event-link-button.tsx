"use client";

import {Event} from "@prisma/client";
import {TooltipTrigger} from "@radix-ui/react-tooltip";
import {Link} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {getEventLink} from "@/lib/utils/event-utils";
import {toast} from "sonner";

type Props = {
    ownerId: Event["ownerId"];
    eventSlug: Event["slug"];
};

export const CopyEventLinkButton = ({ownerId, eventSlug}: Props) => {
    const handleCopy = () => {
        const eventLink = getEventLink({ownerId, eventSlug});
        navigator.clipboard
            .writeText(eventLink)
            .then(() => toast.success("Invite link copied to clipboard"));
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        onClick={handleCopy}
                        variant={"outline"}
                        className="rounded-full"
                    >
                        <Link className="w-4 h-4"/>
                    </Button>
                </TooltipTrigger>

                <TooltipContent className="bg-black text-white text-sm">
                    Copy link to clipboard
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
