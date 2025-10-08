import { useQuery } from "@apollo/client";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

import { READ_ANNOUNCEMENT_QUERY } from "@/queries";
import { Announcement } from "@/types";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/contexts";

export default function AnnouncementInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();

  const { data } = useQuery<{ announcement: Announcement }>(
    READ_ANNOUNCEMENT_QUERY,
    {
      variables: {
        id,
      },
    },
  );

  if (!data?.announcement) return null;

  const announcement = data.announcement;

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Announcement Info | Admin</title>
        <meta
          name="description"
          content="View the details of an announcement, including its content and the author."
        />
      </Helmet>
      <div className="max-w-screen-lg mx-auto p-6">
        <div className="flex flex-col gap-2 mb-6">
          <Button
            variant="flat"
            size="sm"
            color="success"
            className="max-w-fit"
            startContent={<Icon icon="ep:back" />}
            onPress={() => navigate("/admin/announcements")}
          >
            Back to List
          </Button>
          <h1 className="text-2xl font-bold">Announcement Details</h1>
        </div>

        <Card className="w-full" shadow="sm">
          <CardHeader className="flex justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                // src={`https://i.pravatar.cc/150`}
                name={`${announcement.createdBy.firstName.charAt(0)}${announcement.createdBy.lastName.charAt(0)}`}
                size="sm"
              />
              <div className="flex flex-col">
                <p className="text-small font-semibold">
                  {`${announcement.createdBy.firstName} ${announcement.createdBy.lastName}`}
                </p>
                <p className="text-tiny text-default-500">
                  {announcement.createdBy.email}
                </p>
              </div>
            </div>
            <Button
              variant="flat"
              color="success"
              isDisabled={
                !["SUPER_ADMIN", "ADMIN_MANAGE_ANNOUNCEMENTS"].includes(role!)
              }
              className="disabled:cursor-not-allowed"
              startContent={<Icon icon="lucide:edit" />}
              onPress={() =>
                navigate(`/admin/announcements/${announcement.id}/edit`)
              }
            >
              Edit
            </Button>
          </CardHeader>
          <CardBody className="gap-6">
            {/* 	<Button
								variant="flat"
								color="danger"
								startContent={<Icon icon="lucide:trash" />}
								onPress={() => {}}>
								Delete
							</Button> */}

            <Divider />

            <div className="space-y-4">
              <p className="text-gray-500 text-xs">Content</p>
              <p className="px-5 text-default-500 whitespace-pre-wrap">
                {announcement.content}
              </p>
            </div>
          </CardBody>
          <CardFooter>
            <p className="text-small text-default-400">
              <Icon icon="lucide:clock" className="inline-block mr-1" />
              Posted on {formatDate(announcement.createdAt)}
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
