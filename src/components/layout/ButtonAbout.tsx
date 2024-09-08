import Link from "next/link"
import { Button } from "@/components/ui/button"
 
export function ButtonAbout() {
  return (
    <Button variant="default">
      <Link href="">Sobre nós</Link>
    </Button>
  )
}