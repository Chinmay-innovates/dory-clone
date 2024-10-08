import routes from "@/config/routes";
import {
	DesktopDashboardSidebar,
	MobileDashboardSidebar,
} from "@/components/layout/dashboard-sidebar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export const dynamic = "force-dynamic";
export default async function DashboardLayout({ children }: PropsWithChildren) {
	const isAuthenticated = await getKindeServerSession().isAuthenticated();

	if (!isAuthenticated) {
		redirect(routes.login);
	}
	return (
		<div className="flex flex-row h-full">
			<DesktopDashboardSidebar />
			<div className="flex flex-col overflow-auto w-full items-start grow-1">
				<MobileDashboardSidebar />
				{children}
			</div>
		</div>
	);
}
