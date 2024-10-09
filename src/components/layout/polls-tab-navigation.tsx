"use client"

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import routes from "@/config/routes";
import {pollsPageQueryParams} from "@/config/query-params";
import {NavTabButton} from "@/components/buttons/nav-tab-button";

type PollsTab = "live" | "closed"

type Props = {
    ownerId: string,
    eventSlug: string,
}
export const PollsTabNavigation = ({ownerId, eventSlug}: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const showClosed = searchParams.get(pollsPageQueryParams.closed) === "true";

    const eventPollsUrl = routes.eventPolls({
        eventSlug,
        ownerId,
    });

    const activeTab: PollsTab =
        pathname === eventPollsUrl && !showClosed ? "live" : "closed";

    const handleTabChange = (tab: PollsTab) => {
        const newParams = new URLSearchParams();

        if (tab === "closed") {
            newParams.set(pollsPageQueryParams.closed, "true");
        }

        router.replace(`${eventPollsUrl}?${newParams.toString()}`);
    };

    return (
        <nav className="inline-flex">
            <NavTabButton
                isActive={activeTab === "live"}
                onClick={() => handleTabChange("live")}
            >
                Live
            </NavTabButton>

            <NavTabButton
                isActive={activeTab === "closed"}
                onClick={() => handleTabChange("closed")}
            >
                Closed
            </NavTabButton>
        </nav>
    )
}