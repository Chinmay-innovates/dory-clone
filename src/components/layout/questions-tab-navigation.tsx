"use client";

import routes from "@/config/routes";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {questionsPageQueryParams} from "@/config/query-params";
import {NavTabButton} from "@/components/buttons/nav-tab-button";

type QuestionsTab = "open" | "resolved";

type Props = {
    ownerId: string;
    eventSlug: string;
};

export const QuestionsTabNavigation = ({eventSlug, ownerId}: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const showResolved =
        searchParams.get(questionsPageQueryParams.resolved) === "true";

    const eventQuestionsRoute = routes.event({
        eventSlug,
        ownerId,
    });

    const activeTab: QuestionsTab =
        pathname === eventQuestionsRoute && !showResolved ? "open" : "resolved";

    const handleTabChange = (tab: QuestionsTab) => {
        const urlSearchParams = new URLSearchParams();

        if (tab === "resolved") {
            urlSearchParams.set(questionsPageQueryParams.resolved, "true");
        }

        router.replace(`${eventQuestionsRoute}?${urlSearchParams.toString()}`);
    };

    return (
        <nav className="inline-flex">
            <NavTabButton
                isActive={activeTab === "open"}
                onClick={() => handleTabChange("open")}
            >
                Open
            </NavTabButton>

            <NavTabButton
                isActive={activeTab === "resolved"}
                onClick={() => handleTabChange("resolved")}
            >
                Resolved
            </NavTabButton>
        </nav>
    );
};
