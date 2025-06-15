import { Badge } from './ui/badge';

interface BadgeCustomProps {
  title: string;
  color?: 'success' | 'danger' | 'warning';
}

export function BadgeCustom({ title, color = 'success' }: BadgeCustomProps) {
  const colors = {
    success: 'bg-emerald-600 text-zinc-100 hover:bg-emerald-700',
    danger: 'bg-rose-600 text-zinc-100 hover:bg-rose-700',
    warning: 'bg-yellow-600 text-zinc-100 hover:bg-yellow-700'
  };

  return <Badge className={`${colors[color]} duration-200`}>{title}</Badge>;
}
