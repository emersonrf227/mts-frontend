import { LoaderIcon } from 'lucide-react';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';

interface CardFinanceProps {
  title: string;
  subTitle: string;
  icon: {
    name: IconName;
    color: 'success' | 'danger';
  };
  isLoading?: boolean;
}

export function CardFinance({
  title,
  subTitle,
  icon,
  isLoading = false
}: CardFinanceProps) {
  return (
    <div className="flex w-full flex-col items-start rounded-md border-[1px] border-zinc-300 bg-zinc-100 px-4 py-4 dark:border-zinc-700 dark:bg-zinc-800">
      {isLoading ? (
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <h4>Por favor, aguarde</h4>
          <LoaderIcon className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex w-full items-center justify-between gap-2">
            <span className="text-sm font-semibold text-zinc-500">{title}</span>

            <div
              className={`rounded-md p-1 ${
                icon.color === 'success'
                  ? 'border-[1px] border-emerald-600 bg-emerald-100'
                  : 'border-[1px] border-rose-600 bg-rose-100'
              }`}
            >
              <DynamicIcon
                size={18}
                className={`${
                  icon.color === 'success'
                    ? 'stroke-emerald-600'
                    : 'stroke-rose-700'
                }`}
                name={icon.name}
              />
            </div>
          </div>

          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {subTitle}
          </h1>
        </>
      )}
    </div>
  );
}
