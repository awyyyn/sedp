import { studentAtom } from "@/states";
import { Button, ButtonGroup } from "@heroui/button";
import { Tooltip } from "@heroui/tooltip";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useAtomValue } from "jotai";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function FeaturesLayout() {
  const { pathname } = useLocation();
  const scholar = useAtomValue(studentAtom);

  let label = "";

  return (
    <div>
      <h1 className="text-2xl mb-2">
        {scholar?.lastName}, {scholar?.firstName}
      </h1>
      <div className="flex gap-2">
        <Tooltip content="Back">
          <Button
            variant="solid"
            color="primary"
            as={Link}
            to="/admin/scholars"
            className=" "
            isIconOnly
          >
            <Icon icon="iconamoon:arrow-left-2-bold" width="24" height="24" />
          </Button>
        </Tooltip>
        <ButtonGroup>
          <Button
            as={Link}
            to={`allowance-history`}
            variant={pathname.includes("allowance-history") ? "solid" : "flat"}
            color={
              pathname.includes("allowance-history") ? "primary" : "default"
            }
          >
            Allowance
          </Button>
          <Button
            as={Link}
            to={`monthly-docs`}
            variant={pathname.includes("monthly-docs") ? "solid" : "flat"}
            color={pathname.includes("monthly-docs") ? "primary" : "default"}
          >
            Monthly Docs
          </Button>
          <Button
            as={Link}
            to={`semester-docs`}
            variant={pathname.includes("semester-docs") ? "solid" : "flat"}
            color={pathname.includes("semester-docs") ? "primary" : "default"}
          >
            Semester Docs
          </Button>
        </ButtonGroup>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
}
