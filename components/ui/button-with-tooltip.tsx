"use client";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type ButtonProps } from "@/components/ui/button";
import { type ReactElement } from "react";

interface ButtonWithTooltipProps extends Omit<ButtonProps, 'children'> {
  icon: ReactElement;
  tooltipText: string;
  ariaLabel: string;
}

function ButtonWithTooltip({ icon, tooltipText, ariaLabel, ...props }: ButtonWithTooltipProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button {...props} aria-label={ariaLabel}>
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="px-2 py-1 text-xs">{tooltipText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export { ButtonWithTooltip };
