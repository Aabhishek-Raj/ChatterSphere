import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

export const metadata: Metadata = {
  title: 'ChatterSpere',
};

export default function Page() {
  return (
    <div className="mt-16">
      <ModeToggle />
      <h1 className="text-3xl font-bold text-indigo-500">Hello, Next.js!</h1>
      <Button>Click me</Button>
      <Link href="/dashboard">Dashboard</Link>
      <div className="p-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
      </div>
    </div>
  );
}
