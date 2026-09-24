import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[0.25rem] text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wd-orange disabled:pointer-events-none disabled:opacity-50 font-sans tracking-wide",
  {
    variants: {
      variant: {
        default:
          "bg-wd-orange text-white hover:bg-[#ff8e32] shadow-sm active:scale-[0.98]",
        outline:
          "border border-white/25 bg-transparent text-white hover:bg-white hover:text-wd-orange hover:border-white shadow-sm",
        secondary:
          "bg-wd-dark-blue text-white hover:bg-wd-deep-blue border border-white/10",
        ghost:
          "hover:bg-white/10 text-white",
        link:
          "text-wd-orange underline-offset-4 hover:underline",
        // White Desert specific design system variant:
        dsAction:
          "border border-white/20 bg-transparent text-white hover:bg-white hover:text-wd-orange hover:border-white hover:rounded-[0.275rem] min-h-[3.25rem] px-6",
        dsOrange:
          "bg-wd-orange text-white hover:bg-white hover:text-wd-orange min-h-[3.25rem] px-8 rounded-[0.25rem] hover:rounded-[0.275rem]",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-[0.25rem] px-4 text-xs",
        lg: "h-14 rounded-[0.25rem] px-8 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  showIcon?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, showIcon = true, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), "btn-ds-container group")}
        ref={ref}
        {...props}
      >
        <span className="btn-ds-text transition-transform duration-300 ease-wd-ease-out">
          {children}
        </span>
        {showIcon && (
          <span className="btn-ds-icon ml-1.5 transition-all duration-300 ease-wd-ease-out opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100">
            <svg
              className="w-3 h-3"
              fill="none"
              viewBox="0 0 11 11"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.5 1v9M1 5.502h9"
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeWidth="0.75"
              />
              <path
                d="m5.45 3.449 1.99 1.99-1.99 1.99-1.991-1.99z"
                fill="currentColor"
              />
            </svg>
          </span>
        )}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
