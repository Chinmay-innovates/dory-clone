import "server-only";

import { User } from "@prisma/client";
import { db } from "../db";

export const getUserInfo = async (userId: User["id"]) => {
	return db.user.findUnique({
		where: {
			id: userId,
		},
	});
};
