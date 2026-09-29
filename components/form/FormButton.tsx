import type { ReactNode } from "react"
import type { VariantProps } from "class-variance-authority"

import { Button, buttonVariants } from "@/components/ui/button"

type FormButtonProps = {
  btnStyles?: string
  variant?: VariantProps<typeof buttonVariants>["variant"]
  btnType?: "button" | "submit" | "reset"
  size?: VariantProps<typeof buttonVariants>["size"]
  btnText?: string
  isLoading?: boolean
  disabled?: boolean
  IconLeft?: ReactNode
  IconRight?: ReactNode
  handleClick?: () => void
}

const FormButton = ({
  btnStyles,
  variant = "brand",
  btnType = "button",
  size,
  btnText,
  isLoading = false,
  disabled,
  IconLeft,
  IconRight,
  handleClick,
}: FormButtonProps) => {
  return (
    <Button
      variant={variant}
      type={btnType}
      size={size}
      className={btnStyles}
      loading={isLoading}
      disabled={disabled}
      onClick={handleClick}
    >
      {!isLoading && IconLeft}
      {btnText}
      {!isLoading && IconRight}
    </Button>
  )
}

export default FormButton
