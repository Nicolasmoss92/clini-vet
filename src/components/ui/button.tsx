import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-green-500 text-white hover:bg-white hover:text-green-500 shadow", // Padrão verde com letras brancas e hover invertido
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-600", // Exemplo de botão destrutivo
        outline:
          "border border-green-500 bg-transparent text-green-500 hover:bg-green-500 hover:text-white", // Contorno verde com hover invertido
        secondary:
          "bg-green-300 text-white shadow-sm hover:bg-white hover:text-green-500", // Secundário com hover invertido
        ghost: 
          "bg-transparent text-green-500 hover:bg-green-500 hover:text-white", // Fantasma com hover invertido
        link: 
          "text-green-500 underline-offset-4 hover:underline hover:text-green-600", // Link com hover verde mais escuro
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default", // Padrão será verde com letras brancas
      size: "default",
    },
  }
);


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
