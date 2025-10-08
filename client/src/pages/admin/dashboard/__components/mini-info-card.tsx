import { Card, CardBody } from "@heroui/card";
import React from "react";

export default function MiniInfoCard({
  description,
  icon,
  title,
  value,
}: {
  value: number | string;
  description: string;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardBody className="p-5">
        <div className="flex items-center  justify-between">
          <h3 className="font-medium">{title}</h3>
          {icon}
        </div>
        <div className="mt-2">
          <h1 className="text-3xl font-medium">{value}</h1>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
      </CardBody>
    </Card>
  );
}
