import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";

import { formatCurrency, getPercentage } from "@/lib/utils";

interface ScholarStatusStatProps {
  value: number;
  total: number;
  title: string;
  color?: "primary" | "secondary" | "success" | "warning" | "default";
  size?: "sm" | "md" | "lg";
  isAllowance?: boolean;
}

export default function ScholarStatusStat({
  title,
  total,
  value,
  color,
  size = "md",
  isAllowance = false,
}: ScholarStatusStatProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2  justify-between">
        <div className="flex items-center  gap-2">
          <div className={`bg-${color} h-3 w-3 rounded-full`} />
          <h3>{title}</h3>
        </div>
        <div className="flex gap-3">
          <p className="text-gray-400">
            {getPercentage(value, total).toFixed(2)}%
          </p>
          <Chip variant="bordered" size="sm" className="px-2">
            {isAllowance ? formatCurrency(value) : value}
          </Chip>
        </div>
      </div>
      <Progress
        aria-label="scholar-progress"
        // className="bg-[#009689]"

        size={size}
        color={color}
        classNames={
          {
            // indicator: `bg-success/60`,
          }
        }
        value={getPercentage(value, total)}
      />
    </div>
  );
}
