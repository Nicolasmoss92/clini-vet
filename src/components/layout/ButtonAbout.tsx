import Link from "next/link"
import { Button } from "@/components/ui/button"
 
export function ButtonAbout() {
  return (
    <Button variant="outline">
      <Link href="/login">Sobre nós</Link>
    </Button>
  )
}