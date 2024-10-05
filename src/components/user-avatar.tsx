import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { Avatar, AvatarFallback } from "./ui/avatar";
type Props = PropsWithClassName<{
	displayName: string;
	color: string;
}>;

const getFullNameInitials = (name: string) => {
	const initials = name.match(/\b\w/g) || [];
	return initials.join("").toUpperCase();
};
export const UserAvatar = ({ color, displayName, className }: Props) => {
	return (
		<Avatar className={className}>
			<AvatarFallback
				style={{ backgroundColor: color }}
				className="text-black text-sm"
			>
				{getFullNameInitials(displayName)}
			</AvatarFallback>
		</Avatar>
	);
};
