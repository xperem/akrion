// src/components/mdQualification/HistoryList.tsx
'use client';

import { FC } from 'react';

type HistoryItem<Q extends string = string> = {
  question: Q;
  text: string;
  answer: string;
};

type Props<Q extends string> = {
  history: HistoryItem<Q>[];
  getQuestionNumber: (id: Q) => string | undefined;
};

export const HistoryList = <Q extends string>({ history, getQuestionNumber }: Props<Q>) =>
  history.length === 0 ? null : (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des réponses</h3>
      <div className="space-y-3">
        {history.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium">
              {getQuestionNumber(item.question)}
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="text-sm text-gray-700 leading-normal break-words whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
              <p className="text-sm font-medium text-gray-900 mt-1">
                Réponse : {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
