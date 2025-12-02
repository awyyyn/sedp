import { Button, ButtonGroup } from "@heroui/button";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export default function ActivitiesLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {pathname !== "/admin/activities" && (
        <ButtonGroup>
          <Button
            onPress={() => navigate("/admin/activities/events")}
            variant={pathname.includes("events") ? "solid" : "flat"}
            color={pathname.includes("events") ? "primary" : "default"}
          >
            Events
          </Button>
          <Button
            onPress={() => navigate("/admin/activities/meetings")}
            variant={pathname.includes("meetings") ? "solid" : "flat"}
            color={pathname.includes("meetings") ? "primary" : "default"}
          >
            Meetings
          </Button>
          <Button
            onPress={() => navigate("/admin/activities/announcements")}
            variant={pathname.includes("announcements") ? "solid" : "flat"}
            color={pathname.includes("announcements") ? "primary" : "default"}
            // className={cn(
            //   // Base classes, if any, can go here first

            //   // Use object syntax for conditional classes:
            //   {
            //     "bg-primary text-white": pathname.includes("announcements"),
            //     "": !pathname.includes("announcements"),
            //   },
            // )}
          >
            Announcements
          </Button>
        </ButtonGroup>
      )}
      <section className="mt-5">
        <Outlet />
      </section>
    </>
  );
}
