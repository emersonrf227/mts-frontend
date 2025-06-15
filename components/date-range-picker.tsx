'use client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import * as React from 'react';
import { DateRange } from 'react-day-picker';
import ptBR from 'date-fns/locale/pt-BR';

interface ICalendarDateRangePickerProps {
  className?: string;
  value: DateRange | undefined;
  onChange?: (date: DateRange) => void;
}

export function CalendarDateRangePicker({
  className,
  onChange,
  value
}: ICalendarDateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);

  React.useEffect(() => {
    if (date) {
      onChange?.(date);
    }
  }, [date, onChange]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[260px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd LLL, y', {
                    locale: ptBR
                  })}{' '}
                  -{' '}
                  {format(date.to, 'dd LLL, y', {
                    locale: ptBR
                  })}
                </>
              ) : (
                format(date.from, 'dd LLL, y', {
                  locale: ptBR
                })
              )
            ) : (
              <span>Escolha uma data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
