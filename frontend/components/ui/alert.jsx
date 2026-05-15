import * as React from "react"

import { cn } from "@/lib/utils"

const alertVariantClasses = {
  default: "",
  destructive: "alert-destructive",
}

function Alert({
  className,
  variant = "default",
  ...props
}) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn("alert", alertVariantClasses[variant], className)}
      {...props} />
  );
}

function AlertTitle({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-title"
      className={cn("alert-title", className)}
      {...props} />
  );
}

function AlertDescription({
  className,
  ...props
}) {
  return (
    <div
      data-slot="alert-description"
      className={cn("alert-description", className)}
      {...props} />
  );
}

export { Alert, AlertTitle, AlertDescription }
