'use client';
import clsx from 'clsx';
import { FC, ReactNode } from 'react';

export const WizardLayout: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={clsx(
      'w-[800px] max-w-full mx-auto space-y-6', // largeur & spacing interne
      className                                  // → permet mt-8 venant du parent
    )}
  >
    {children}
  </div>
);
