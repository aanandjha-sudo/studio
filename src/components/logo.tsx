import { Video } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2 text-primary">
      <Video className="h-7 w-7" />
      <h1 className="text-2xl font-bold font-headline tracking-tighter">
        BRO'S SHARE
      </h1>
    </div>
  );
}
