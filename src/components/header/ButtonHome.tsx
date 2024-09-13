import Link from "next/link"
import { Button } from "@/components/ui/button"
 
export function ButtonHome() {
  return (
    <Button variant="default">
      <Link href="/home">Inicio</Link>
    </Button>
  )
}