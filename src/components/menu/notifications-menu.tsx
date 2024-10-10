"use client"
import React from "react";
import {Notification} from "@prisma/client";
import {cn, PropsWithClassName} from "@/lib/utils/ui-utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {match} from "ts-pattern";
import {Bell} from "lucide-react";
import routes from "@/config/routes";
import {buttonVariants} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {defaultDateFormatter} from "@/lib/utils/date-utils";
import {NotificationDetail} from "@/lib/prisma/validators/notification-validator";
import {pollsPageQueryParams, questionsPageQueryParams} from "@/config/query-params";

type  Props = PropsWithClassName<{
    initialNotifications: Notification[]
}>

export const NotificationsMenu = ({initialNotifications, className}: Props) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const notifications = initialNotifications
    const showDot = false;

    const handleOpenNotification = () => {
    }
    const markNotificationAsRead = () => {
    }
    const loadMoreNotifications = () => {
    }
    return (
        <DropdownMenu modal open={isOpen} onOpenChange={setIsOpen}>

            <DropdownMenuTrigger>
                <Bell className={className}/>
                {showDot && (
                    <div className="absolute right-0 top-0 rounded-full bg-red-500 w-[8px] h-[8px]"/>
                )}
                <DropdownMenuContent className="py-4 px-2 space-y-1 w-[300px] h-[300px] overflow-auto ">
                    <ScrollArea className="h-full bg-white rounded-b-lg">
                        <DropdownMenuLabel className="inline-flex items-center gap-x-1">
                            <span>Notifications</span>
                            <Bell className="size-4"/>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        {/* List of notifications */}
                        <NotificationsList
                            //@ts-ignore
                            notifications={notifications}
                            hasMoreNotifications={false}
                            onOpenNotification={handleOpenNotification}
                            onReadNotification={markNotificationAsRead}
                            loadMoreNotifications={loadMoreNotifications}
                        />
                    </ScrollArea>
                </DropdownMenuContent>
            </DropdownMenuTrigger>
        </DropdownMenu>
    )
}

const NotificationsList = ({
                               notifications,
                               hasMoreNotifications,
                               loadMoreNotifications,
                               onOpenNotification,
                               onReadNotification,
                           }: {
    notifications: NotificationDetail[];
    hasMoreNotifications: boolean;
    loadMoreNotifications: () => void;
    onReadNotification: (notification: NotificationDetail) => void;
    onOpenNotification: (notification: NotificationDetail) => void;
}) => {
    const handleOpenNotification = (notification: NotificationDetail) => {
        onReadNotification(notification);
        onOpenNotification(notification);
    };

    return (
        <div className="space-y-1">
            {/* Empty notifications */}
            {notifications.length === 0 && (
                <p className="text-sm">No notifications to show!</p>
            )}

            {notifications.map((notification: NotificationDetail) => (
                <React.Fragment key={notification.id}>
                    <NotificationItem
                        notification={notification}
                        onOpen={() => handleOpenNotification(notification)}
                    />
                </React.Fragment>
            ))}

            {hasMoreNotifications && (
                <div className="flex items-center">
                    <button
                        className={cn(
                            buttonVariants({variant: "ghost"}),
                            "text-xs text-blue-500 mx-auto"
                        )}
                        onClick={loadMoreNotifications}
                    >
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

const NotificationItem = ({notification, onOpen: handleOpen}: {
    notification: NotificationDetail;
    onOpen: () => void;
}) => {
    const label = match(notification.type)
        .with("NEW_QUESTION", () => "You got a new question 🗣️")
        .with("QUESTION_RESOLVED", () => "Your question has been resolved ✅")
        .with("QUESTION_PINNED", () => "Your question was pinned by the owner 📌")
        .with("QUESTION_UPVOTE", () => "Your question got an upvote 👍🏻")
        .with("POLL_CLOSED", () => "A poll you voted on was marked as concluded.")
        .exhaustive();

    const linkHref = match(notification.type)
        .with(
            "NEW_QUESTION",
            "QUESTION_PINNED",
            "QUESTION_UPVOTE",
            () => `${routes.event({
                eventSlug: notification.event.slug,
                ownerId: notification.event.ownerId,
            })}?${questionsPageQueryParams.questionId}=${notification.questionId}
        `)
        .with(
            "QUESTION_RESOLVED",
            () => `${routes.event({
                eventSlug: notification.event.slug,
                ownerId: notification.event.ownerId,
            })}?${questionsPageQueryParams.questionId}=${notification.questionId}&${
                questionsPageQueryParams.resolved
            }=true
        `)
        .with(
            "POLL_CLOSED",
            () => `${routes.eventPolls({
                eventSlug: notification.event.slug,
                ownerId: notification.event.ownerId,
            })}?${pollsPageQueryParams.pollId}=${notification.pollId}&${
                pollsPageQueryParams.closed
            }=true
        `).exhaustive();

    return (
        <DropdownMenuItem>
            <Link
                href={linkHref}
                prefetch={false}
                onClick={handleOpen}
                className={cn("w-full flex flex-col items-start h-[48px] px-2 gap-y-1",
                    {
                        "border-l border-l-blue-500": !notification.read,
                    }
                )}
            >
                <div className="inline-flex items-center">
                    <p className={cn("text-xs", {"font-semibold": !notification.read})}>
                        {label}
                    </p>
                </div>

                <time className="text-[8px] font-light">
                    {defaultDateFormatter.format(notification.createdAt)}
                </time>
            </Link>
        </DropdownMenuItem>
    );
};