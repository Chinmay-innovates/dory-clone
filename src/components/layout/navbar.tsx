import routes from "@/config/routes";
import Link from "next/link";
import { Suspense } from "react";
import { AuthLoader } from "../loader";
import { AuthButtons } from "../buttons/auth-buttons";
import Image from "next/image";

export const Navbar = () => {
	return (
		<header className="bg-blue-600 text-primary-foreground h-16 flex items-center px-4 lg:px-8 shrink-0 grow-0">
			<Link href={routes.home} className="inline-flex items-end gap-x-2">
				<Logo />
			</Link>

			<Suspense fallback={<AuthLoader className="ml-auto" />}>
				<AuthButtons className="ml-auto" />
			</Suspense>
		</header>
	);
};

// const Logo = () => <Flame color="white" size={28} />;
const Logo = () => (
	<Image src="/logo.svg" alt="Logo" width={100} height={100} />
);
