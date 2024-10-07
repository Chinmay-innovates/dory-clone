"use client";

import routes from "@/app/config/routes";
import { cn } from "@/lib/utils/ui-utils";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { BookMarked, Component, LogOut, Menu, User2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarItem } from "./sidebar-item";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { buttonVariants } from "../ui/button";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const sidebarItems = [
	{
		name: "Your Events",
		route: routes.dashboard,
		Icon: Component,
	},
	{
		name: "Bookmarks",
		route: routes.bookmarked,
		Icon: BookMarked,
	},
	{
		name: "Account",
		route: routes.account,
		Icon: User2,
	},
] as const;

export const DesktopDashboardSidebar = ({ className }: PropsWithClassName) => {
	return (
		<aside
			className={cn(
				"border-r-blue-500/30 h-full shrink-0 grow-0 bg-white border-r hidden lg:block lg:basis-[250px]",
				className
			)}
		>
			<DashboardSidebarContent />
		</aside>
	);
};

export const MobileDashboardSidebar = () => {
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger className="pl-4 pt-4 lg:hidden">
				<div className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
					<Menu className="size-5 mr-0.5" />
					<span>Menu</span>
				</div>
			</SheetTrigger>

			<SheetContent className="w-[250px] p-0 pt-2" side="left">
				<DashboardSidebarContent />
			</SheetContent>
		</Sheet>
	);
};

export const DashboardSidebarContent = () => {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<div className="flex flex-col h-full py-8 px-3">
			<nav className="flex flex-col gap-y-2">
				{sidebarItems.map((item) => {
					const isActive = item.route === pathname;

					return (
						<button key={item.name} onClick={() => router.replace(item.route)}>
							<SidebarItem
								icon={item.Icon}
								isActive={isActive}
								text={item.name}
							/>
						</button>
					);
				})}
			</nav>

			<div className="mt-auto w-full">
				<LogoutLink
					className={cn(buttonVariants({ variant: "outline" }), "w-full")}
				>
					<LogOut className="w-4 h-4" />
					<span className="ml-2">Logout</span>
				</LogoutLink>
			</div>
		</div>
	);
};
