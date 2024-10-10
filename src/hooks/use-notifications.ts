import {useEffect, useState} from "react";
import {NotificationDetail} from "@/lib/prisma/validators/notification-validator";
import {useAction} from "next-safe-action/hooks";
import {readNotificationAction} from "@/lib/actions/read-notification-action";
import {getUserNotificationsAction} from "@/lib/actions/read-user-notifications-action";
import {getUserUnseenNotificationsAction} from "@/lib/actions/get-user-unseen-notifications-action";

type Params = {
    initialNotifications: NotificationDetail[];
};

export const useNotifications = ({initialNotifications}: Params) => {
        const [notifications, setNotifications] = useState(initialNotifications);
        const [hasMoreNotifications, setHasMoreNotifications] = useState(true);
        const FETCH_INTERVAL = 10_000; //10 SECS

        const [showDot, setShowDot] = useState(notifications?.some((nt) => !nt.read));

        const {execute: readNotification} = useAction(readNotificationAction);
        const {executeAsync: getUserNotifications} = useAction(getUserNotificationsAction);
        const {executeAsync: getUserUnseenNotifications} = useAction(getUserUnseenNotificationsAction)

        const loadMoreNotifications = async () => {
            const newNotifications = await getUserNotifications({
                cursor: notifications.at(-1)?.id,
            });
            if (newNotifications?.data?.length) {
                setNotifications((prev) => [...prev, ...(newNotifications.data ||
                    [])])
            } else setHasMoreNotifications(false);
        };

        const markNotificationAsRead = (notification: NotificationDetail) => {
            if (!notification.read) {
                // update the UI (optimistic)
                setNotifications(prev =>
                    prev.map(nt => (nt.id === notification.id ? {
                        ...nt,
                        read: true,
                    } : nt))
                );
                readNotification({notificationId: notification.id});
            }
        };

        useEffect(() => {
            const fetchUnseenNotifications = async () => {
                console.log("Fetching unseen notifications");

                const unseenNotifications = await getUserUnseenNotifications();

                // No new notification
                if (!unseenNotifications?.data || unseenNotifications.data.length === 0) return

                console.log("Got new notifications");
                setShowDot(true);
                setNotifications(prev => [
                    ...(unseenNotifications.data || []),
                    ...prev,
                ]);

            }
            const interval = setInterval(fetchUnseenNotifications, FETCH_INTERVAL)
            return () => clearInterval(interval);
        }, [getUserUnseenNotifications])

        return {
            notifications,
            hasMoreNotifications,
            showDot,
            setShowDot,
            loadMoreNotifications,
            markNotificationAsRead,
        };
    }
;
