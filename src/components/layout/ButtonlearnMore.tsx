import Link from "next/link"
import { Button } from "@/components/ui/button"
 
export function ButtonLearnAbout() {
  return (
    <Button variant="default">
      <Link href="/login">Saiba mais</Link>
    </Button>
  )
}