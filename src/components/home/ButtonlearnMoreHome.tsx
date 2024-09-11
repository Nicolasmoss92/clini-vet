import Link from "next/link"
import { Button } from "@/components/ui/button"
 
export function ButtonLearnAboutHome() {
  return (
    <Button variant="default">
      <Link href="/about">Saiba mais</Link>
    </Button>
  )
}