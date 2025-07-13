'use client';

import { FC } from 'react';
import { ArrowUpRight } from 'lucide-react';

type Props = {
  title: string;
  description: string;
  url: string;
  source?: string;
};

export const ResourceCard: FC<Props> = ({ title, description, url, source }) => {
  return (
    <div className="bg-white border rounded-2xl shadow-md p-6 hover:shadow-lg transition w-full h-full">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-indigo-700">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline mt-2"
        >
          Ouvrir le lien <ArrowUpRight className="w-4 h-4" />
        </a>
        {source && (
          <p className="text-xs text-gray-400 mt-2">Source : {source}</p>
        )}
      </div>
    </div>
  );
};
