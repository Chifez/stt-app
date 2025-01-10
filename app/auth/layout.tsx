'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <p className="font-bold">Convertly</p>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/auth/login">
            <Button
              variant="ghost"
              className={pathname === '/auth/login' ? 'bg-secondary' : ''}
            >
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button
              variant="ghost"
              className={pathname === '/auth/register' ? 'bg-secondary' : ''}
            >
              Register
            </Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <div className="container flex items-center justify-center min-h-[calc(100vh-56px)]">
          {children}
        </div>
      </main>
    </div>
  );
}
