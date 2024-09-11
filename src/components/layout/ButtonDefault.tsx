import Link from "next/link"
import { Button } from "@/components/ui/button"
 
export function ButtonAsChild() {
  return (
    <Button variant="default">
      <Link href="/about">Login</Link>
    </Button>
  )
}