import * as React from 'react';
import { ChevronRightIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';
import { useTheme } from '@/components/layout/ThemeToggle/theme-provider';

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<'nav'> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => {
  const [primaryColor, setPrimaryColor] = React.useState<string | null>(null);
  const [fontColor, setFontColor] = React.useState<string | null>(null);
  const theme = useTheme();
  React.useEffect(() => {
    setPrimaryColor(theme.primaryColor);
    setFontColor(theme.fontColor);
  }, [theme.primaryColor]);
  return (
    <nav
      ref={ref}
      style={{
        backgroundColor: primaryColor ? `${primaryColor}` : '#FFF',
        color: fontColor ? `${fontColor}` : '#666'
      }}
      aria-label="breadcrumb"
      {...props}
    />
  );
});
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<'ol'>
>(({ className, ...props }, ref) => {
  const [primaryColor, setPrimaryColor] = React.useState<string | null>(null);
  const [fontColor, setFontColor] = React.useState<string | null>(null);
  const theme = useTheme();
  React.useEffect(() => {
    setPrimaryColor(theme.primaryColor);
    setFontColor(theme.fontColor);
  }, [theme.primaryColor]);

  return (
    <ol
      ref={ref}
      style={{
        backgroundColor: primaryColor ? `${primaryColor}` : '#FFF',
        color: fontColor ? `${fontColor}` : '#666'
      }}
      className={cn(
        'flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5',
        className
      )}
      {...props}
    />
  );
});
BreadcrumbList.displayName = 'BreadcrumbList';

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<'li'>
>(({ className, ...props }, ref) => {
  const [primaryColor, setPrimaryColor] = React.useState<string | null>(null);
  const [fontColor, setFontColor] = React.useState<string | null>(null);
  const theme = useTheme();
  React.useEffect(() => {
    setPrimaryColor(theme.primaryColor);
    setFontColor(theme.fontColor);
  }, [theme.primaryColor]);
  return (
    <li
      style={{
        backgroundColor: primaryColor ? `${primaryColor}` : '#FFF',
        color: fontColor ? `${fontColor}` : '#666'
      }}
      ref={ref}
      className={cn('inline-flex items-center gap-1.5', className)}
      {...props}
    />
  );
});
BreadcrumbItem.displayName = 'BreadcrumbItem';

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<'a'> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a';
  const [primaryColor, setPrimaryColor] = React.useState<string | null>(null);
  const [fontColor, setFontColor] = React.useState<string | null>(null);
  const theme = useTheme();
  React.useEffect(() => {
    setPrimaryColor(theme.primaryColor);
    setFontColor(theme.fontColor);
  }, [theme.primaryColor]);

  return (
    <Comp
      ref={ref}
      style={{
        backgroundColor: primaryColor ? `${primaryColor}` : '#FFF',
        color: fontColor ? `${fontColor}` : '#666'
      }}
      className={cn('transition-colors hover:text-foreground', className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = 'BreadcrumbLink';

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<'span'>
>(({ className, ...props }, ref) => {
  const [primaryColor, setPrimaryColor] = React.useState<string | null>(null);
  const [fontColor, setFontColor] = React.useState<string | null>(null);
  const theme = useTheme();
  React.useEffect(() => {
    setPrimaryColor(theme.primaryColor);
    setFontColor(theme.fontColor);
  }, [theme.primaryColor]);
  return (
    <span
      ref={ref}
      style={{
        backgroundColor: primaryColor ? `${primaryColor}` : '#FFF',
        color: fontColor ? `${fontColor}` : '#666'
      }}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('font-normal text-foreground', className)}
      {...props}
    />
  );
});
BreadcrumbPage.displayName = 'BreadcrumbPage';

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<'li'>) => {
  const [primaryColor, setPrimaryColor] = React.useState<string | null>(null);
  const [fontColor, setFontColor] = React.useState<string | null>(null);
  const theme = useTheme();
  React.useEffect(() => {
    setPrimaryColor(theme.primaryColor);
    setFontColor(theme.fontColor);
  }, [theme.primaryColor]);
  return (
    <li
      role="presentation"
      style={{
        backgroundColor: primaryColor ? `${primaryColor}` : '#FFF',
        color: fontColor ? `${fontColor}` : '#666'
      }}
      aria-hidden="true"
      className={cn('[&>svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  );
};
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => {
  const [primaryColor, setPrimaryColor] = React.useState<string | null>(null);
  const [fontColor, setFontColor] = React.useState<string | null>(null);
  const theme = useTheme();
  React.useEffect(() => {
    setPrimaryColor(theme.primaryColor);
    setFontColor(theme.fontColor);
  }, [theme.primaryColor]);
  return (
    <span
      role="presentation"
      style={{
        backgroundColor: primaryColor ? `${primaryColor}` : '#FFF',
        color: fontColor ? `${fontColor}` : '#666'
      }}
      aria-hidden="true"
      className={cn('flex h-9 w-9 items-center justify-center', className)}
      {...props}
    >
      <DotsHorizontalIcon className="h-4 w-4" />
      <span className="sr-only">More</span>
    </span>
  );
};
BreadcrumbEllipsis.displayName = 'BreadcrumbElipssis';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
};
