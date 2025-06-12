'use client';

import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';

const HeaderItem = () => {
  const router = useRouter();

  const handleTabChange = (value: string) => {
    router.push(`/${value}`);
  };

  return (
    <div className="h-full flex items-center p-3 ">
      <Tabs onValueChange={handleTabChange} defaultValue={'account'} className="w-[400px]">
        <TabsList className="bg-transparent">
          <TabsTrigger value="/" className="bg-transparent">
            <div className="font-bold text-2xl text-indigo-500">TBT charts</div>
          </TabsTrigger>
          <TabsTrigger value="position">Position</TabsTrigger>
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <Separator className="w-[2px] bg-zinc-500 dark:text-indigo-500 rounded-md h-10 mx-auto" />
        </TabsList>
      </Tabs>
    </div>
  );
};

export default HeaderItem;
