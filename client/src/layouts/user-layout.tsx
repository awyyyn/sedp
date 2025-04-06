import { Outlet } from "react-router-dom";

import UserHeader from "./__components/user-header";

export default function UserLayout() {
	return (
		<div>
			<UserHeader />
			<main className=" ">
				<Outlet />
			</main>
		</div>
	);
}
