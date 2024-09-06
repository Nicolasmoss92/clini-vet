import {
  ClipboardPlus,
  HandHeart,
  Syringe,
  BookHeart,
  Pill,
  ShoppingBasket,
  Shapes
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownService() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Produtos</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
        <DropdownMenuItem>
            <ShoppingBasket className="mr-2 h-4 w-4" />
            <span>Rações</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Pill className="mr-2 h-4 w-4" />
            <span>Farmacia</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Shapes className="mr-2 h-4 w-4" />
            <span>Brinquedos</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Shapes className="mr-2 h-4 w-4" />
            <span>Brinquedos</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
