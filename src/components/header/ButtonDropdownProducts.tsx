import {
  ClipboardPlus,
  HandHeart,
  Syringe,
  BookHeart,
  Pill
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DropdownProducts() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">Serviços</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Syringe  className="mr-2 h-4 w-4" />
            <span>Cirurgias</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ClipboardPlus className="mr-2 h-4 w-4" />
            <span>Plantões</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HandHeart className="mr-2 h-4 w-4" />
            <span>Amo Pet Sister</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BookHeart className="mr-2 h-4 w-4" />
            <span>Reabilitação e Terapia</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
