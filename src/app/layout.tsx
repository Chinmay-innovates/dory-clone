import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils/ui-utils";
import React from "react";
import {Toaster} from "@/components/ui/sonner";

const font = Noto_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Dory Clone | Real-time Q&A and Polls",
	description: "Connect with your audience in real-time with Dory Clone",
	icons: {
		icon: "/dory.webp",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full" suppressHydrationWarning>
			<body className={cn("h-full bg-zinc-100", font.className)}>
				{children}
				<Toaster richColors theme="light" />
			</body>
		</html>
	);
}
