import { Button, ButtonProps } from "@heroui/button";

import { useAuth } from "@/contexts";
import { SystemUserRole } from "@/types";

interface RoleBasedButtonProps extends ButtonProps {
	allowedRoles: SystemUserRole[];
}

export const RoleBasedButton = ({
	allowedRoles,
	children,
	color = "primary",
	className = "",
	...buttonProps
}: RoleBasedButtonProps) => {
	const { role } = useAuth();

	return (
		<Button
			{...buttonProps}
			color={color}
			className={className}
			isDisabled={
				buttonProps.isDisabled || !allowedRoles.includes(role as SystemUserRole)
			}>
			{children}
		</Button>
	);
};
