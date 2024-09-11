import Link from 'next/link';
import {
  ClipboardPlus,
  HandHeart,
  Syringe,
  BookHeart
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DropdownProducts() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">Serviços</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <Link href="/header/surgery">
            <DropdownMenuItem>
              <Syringe className="mr-2 h-4 w-4" />
              <span>Cirurgias</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/header/onDuty">
            <DropdownMenuItem>
              <ClipboardPlus className="mr-2 h-4 w-4" />
              <span>Plantões</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/header/petSister">
            <DropdownMenuItem>
              <HandHeart className="mr-2 h-4 w-4" />
              <span>Amo Pet Sister</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/header/reabilit">
            <DropdownMenuItem>
              <BookHeart className="mr-2 h-4 w-4" />
              <span>Reabilitação e Terapia</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
