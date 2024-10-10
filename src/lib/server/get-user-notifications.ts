import "server-only"
import {Notification} from "@prisma/client";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import {prisma} from "@/lib/prisma/client";
import {notificationDetail} from "@/lib/prisma/validators/notification-validator";

type Params = {
    unseenOnly?: boolean;
    cursor?: Notification["id"];
}
export const getUserNotifications = async ({unseenOnly = false, cursor}: Params = {}) => {
    const user = await getKindeServerSession().getUser();
    if (!user) {
        throw new Error("Not authenticated!");
    }
    const notifications = await prisma.notification.findMany({
        where: {
            userId: user.id,
            ...(unseenOnly ? {seen: false} : {}),
        },
        ...notificationDetail,
        orderBy: {
            createdAt: "desc",
        },
        take: 20,
        skip: cursor ? 1 : 0,
        ...(cursor ? {cursor: {id: cursor}} : {}),
    });

    const unseenNotificationIds = unseenOnly
        ? notifications.map((notification) => notification.id)
        : notifications
            .filter((notification) => !notification.seen)
            .map((notification) => notification.id);

    // mark the unseen notifications as seen
    if (unseenNotificationIds.length > 0) {
        await prisma.notification.updateMany({
            where: {
                id: {
                    in: unseenNotificationIds,
                },
            },
            data: {
                seen: true,
            },
        });
    }

    return notifications;
}