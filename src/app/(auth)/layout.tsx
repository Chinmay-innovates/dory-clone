import { Navbar } from "@/components/layout/navbar";
import { PropsWithChildren } from "react";

export const dynamic = "force-dynamic";
const AuthLayout = ({ children }: PropsWithChildren) => {
	return (
		<>
			<Navbar />
			<main className="h-[calc(100vh-68px)]">{children}</main>
		</>
	);
};
export default AuthLayout;
