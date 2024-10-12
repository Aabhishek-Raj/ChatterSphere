'use client';

import { ToolTip } from '@/components/actions/tooltip';
import { UserAvatar } from '@/components/UserAvatar';
import { cn } from '@/lib/utils';
import { Member, Profile } from '@prisma/client';
import { Edit, ShieldAlert, ShieldCheck } from 'lucide-react';

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

export const MessageItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full ">
      <div className="group flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer ">
                {member.profile.name}
              </p>
              <ToolTip label={member.role}>{roleIconMap[member.role]}</ToolTip>
            </div>
            <span className="tex-xs text-zinc-500 dark:text-zinc-400 ">{timestamp}</span>
          </div>
          <p
            className={cn(
              'text-sm text-zinc-600 dark:text-zinc-300',
              deleted && 'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
            )}
          >
            {content}
            {isUpdated && !deleted && (
              <span className="text-10px mx-2 text-zinc-500 dark:text-zinc-400">(edited)</span>
            )}
          </p>
        </div>
      </div>
      {true && (
        <ToolTip label="Edit">
          <Edit
            className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600
            dark:hover:text-zinc-300 transition"
          />
        </ToolTip>
      )}
    </div>
  );
};
