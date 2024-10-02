import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import RequireAuth from '@/middleware/requireAuth';

export const metadata: Metadata = {
  title: 'ChatterSpere',
};

export default function Page() {
  return (
    <div className="">
      <ModeToggle />
      <h1 className="text-3xl font-bold text-indigo-500">Hello, Next.js!</h1>
      <Button>Click me</Button>
      <Link href="/dashboard">Dashboard</Link>
    </div>
  );
}
