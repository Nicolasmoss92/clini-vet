import Link from "next/link"
import { Button } from "@/components/ui/button"
 
export function ButtonContact() {
  return (
    <Button variant="outline">
      <Link href="/login">Contato</Link>
    </Button>
  )
}