import { initialProfile } from '@/app/actions/initial-profile';
import { NavigationAction } from '../NavigattionAction';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { Separator } from '@/components/ui/separator';
import { NavigationItem } from '../NavigationItem';
import { ModeToggle } from '@/components/mode-toggle';
import { ScrollArea } from '@/components/ui/scroll-area';

export const NavigationSidebar = async () => {
  const profile = await initialProfile();
  console.log(profile, 'currentUser');

  if (!profile) {
    return redirect('/');
  }
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  console.log(servers, 'serveer');

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-500 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl} />
          </div>
        ))}
      </ScrollArea>
      <div className="p-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
      </div>
    </div>
  );
};
