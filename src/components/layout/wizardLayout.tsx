'use client';

import clsx from 'clsx';
import { FC, ReactNode } from 'react';

/**
 * Conteneur vertical flexible.  
 * → Plus de largeur fixe : la largeur est héritée du parent.
 */
export const WizardLayout: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={clsx('space-y-6', className)}>
    {children}
  </div>
);
