import { Stethoscope, Moon, Heart, Activity, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DropdownService() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="flex items-center gap-1">
          Serviços <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          {[
            { href: '/header/surgery',   icon: Stethoscope, label: 'Cirurgias' },
            { href: '/header/onDuty',    icon: Moon,        label: 'Plantões' },
            { href: '/header/petSister', icon: Heart,       label: 'Pet Sister' },
            { href: '/header/reabilit',  icon: Activity,    label: 'Reabilitação e Terapia' },
          ].map(({ href, icon: Icon, label }) => (
            <DropdownMenuItem key={href} asChild className="focus:bg-green-600 focus:text-white hover:bg-green-600 hover:text-white cursor-pointer rounded-lg">
              <Link href={href} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
