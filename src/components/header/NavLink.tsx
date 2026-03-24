import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface NavLinkProps {
  href: string;
  label: string;
}

export function NavLink({ href, label }: NavLinkProps) {
  return (
    <Button variant="default">
      <Link href={href}>{label}</Link>
    </Button>
  );
}
