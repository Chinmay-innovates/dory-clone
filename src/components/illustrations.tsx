"use client";

import { cn } from "@/lib/utils/ui-utils";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import routes from "@/config/routes";
import React from "react";

type Props = PropsWithClassName<{
	width?: number;
	height?: number;
	children?: React.ReactNode;
}>;

export const NotFound = ({
	width = 180,
	height = 180,
	children,
	className,
}: Props) => (
	<div className={cn("flex flex-col items-center p-3", className)}>
		<Image src="/empty.svg" alt="empty" height={height} width={width} />
		{children}
		<HomeButton />
	</div>
);

export const NoContent = ({
	width = 180,
	height = 180,
	children,
	className,
}: Props) => (
	<div className={cn("flex flex-col items-center", className)}>
		<Image src="/create.svg" alt="empty" height={height} width={width} />
		{children}
	</div>
);

const HomeButton = () => {
	return (
		<Button size="default" variant="secondary" className="mt-2" asChild>
			<Link href={routes.dashboard}>Go back to home</Link>
		</Button>
	);
};
