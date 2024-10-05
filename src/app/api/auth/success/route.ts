import routes, { baseUrl } from "@/app/config/routes";
import { db } from "@/lib/db";
import { faker } from "@faker-js/faker";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import colors from "tailwindcss/colors";

// will run every time a user signs up or sign in
export async function GET() {
	const { getUser } = getKindeServerSession();

	const user = await getUser();

	if (!user || !user.id) {
		throw new Error("Something went wrong with authentication: " + user);
	}

	// check if the user exists in the db
	let dbUser = await db.user.findUnique({
		where: { id: user.id },
	});

	// user were not found, we will create it
	if (!dbUser) {
		dbUser = await db.user.create({
			data: {
				id: user.id,
				displayName:
					user.username ?? user.given_name ?? faker.internet.userName(),
				email: user.email ?? "",
				color: faker.helpers.arrayElement([
					colors.emerald["500"],
					colors.yellow["500"],
					colors.purple["500"],
					colors.amber["500"],
					colors.green["500"],
					colors.pink["500"],
					colors.red["500"],
				]),
			},
		});
	}

	// redirect the user to dashboard page
	return NextResponse.redirect(`${baseUrl}${routes.dashboard}`);
}
