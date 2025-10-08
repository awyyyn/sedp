import { Outlet } from "react-router-dom";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSetAtom } from "jotai";

import NotificationDropdown from "./__components/admin-notifications";

import { AppSidebar } from "@/components";
import { sidebarAtom } from "@/states";
import { useAuth } from "@/contexts";

export default function AdminLayout() {
  const { office } = useAuth();
  const setIsSidebarOpen = useSetAtom(sidebarAtom);

  return (
    <div className="flex min-h-dvh max-h-[100dvh] h-[100dvh] overflow-hidden">
      <AppSidebar />
      <main className="w-full relative px-3 sm:px-0  overflow-hidden  ">
        <div className="absolute h-16  bg-[#A6F3B235] z-[20]  top-0 left-0 right-0  backdrop-blur-lg  ">
          <div className="gap-2 items-center justify-between   h-full flex mx-auto container px-3 sm:px-5  ">
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                variant="flat"
                onPress={() => setIsSidebarOpen(true)}
                size="sm"
                className=" block md:hidden"
              >
                <Icon fontSize={30} icon="stash:burger-arrow-right" />
              </Button>

              <h1 className="font-medium">{office} Office</h1>
            </div>

            {/* <Breadcrumbs className="py-4 md:py-6">
							{breadcrumbs.map((item, index) => (
								<BreadcrumbItem
									href={item.href}
									className="capitalize"
									key={item.href + index}>
									{item.label.split("-").join(" ")}
								</BreadcrumbItem>
							))}
						</Breadcrumbs> */}
            <div className="flex gap-2">
              <NotificationDropdown />
              {/* <Button isIconOnly variant="light" className="rounded-full">
								<Icon icon="solar:settings-linear" width="24" height="24" />
							</Button> */}
            </div>
          </div>
        </div>

        <section className="overflow-y-scroll h-full pt-[4.5rem] md:pt-20 scrollbar-hide mx-auto container px-3 sm:px-5 ">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
