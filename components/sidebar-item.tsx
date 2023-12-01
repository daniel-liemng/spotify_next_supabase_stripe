import { cn } from '@/lib/utils.';
import Link from 'next/link';
import { IconType } from 'react-icons';

interface SidebarItemProps {
  label: string;
  href: string;
  active?: boolean;
  icon: IconType;
}

const SidebarItem = ({ label, href, active, icon: Icon }: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center h-auto w-full gap-x-4 text-base font-medium cursor-pointer hover:text-white transition text-neutral-400 py-1',
        active && 'text-white'
      )}
    >
      <Icon size={26} />
      <p className='truncate w-full'>{label}</p>
    </Link>
  );
};

export default SidebarItem;
