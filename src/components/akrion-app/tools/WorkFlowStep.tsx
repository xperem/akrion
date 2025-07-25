// components/akrion-app/WorkflowStep.tsx
'use client';

import { CheckCircle, PlayCircle, Clock, Settings, Lock, AlertCircle } from 'lucide-react';

type StatusType = 'completed' | 'in-progress' | 'pending' | 'available' | 'blocked';
type ColorType = 'emerald' | 'blue' | 'amber' | 'gray' | 'red';

interface WorkflowStepProps {
  id: string;
  title: string;
  description: string;
  status: StatusType;
  color: ColorType;
  icon: React.ComponentType<{ className?: string }>;
  blockReason?: string;
  onLaunch: (toolId: string) => void;
  onEdit: (toolId: string) => void;
}

const StatusIcon = ({ status, color }: { status: StatusType; color: ColorType }) => {
  const colorMap: Record<ColorType, string> = {
    emerald: 'text-emerald-600 bg-emerald-50',
    blue: 'text-blue-600 bg-blue-50',
    amber: 'text-amber-600 bg-amber-50',
    gray: 'text-gray-400 bg-gray-50',
    red: 'text-red-600 bg-red-50'
  };

  if (status === 'completed') {
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorMap.emerald}`}>
        <CheckCircle className="w-4 h-4" />
      </div>
    );
  }
  
  if (status === 'available') {
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorMap.blue}`}>
        <PlayCircle className="w-4 h-4" />
      </div>
    );
  }

  if (status === 'blocked') {
    return (
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorMap.red}`}>
        <Lock className="w-4 h-4" />
      </div>
    );
  }
  
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorMap.gray}`}>
      <Clock className="w-4 h-4" />
    </div>
  );
};

export function WorkflowStep({
  id,
  title,
  description,
  status,
  color,
  icon: Icon,
  blockReason,
  onLaunch,
  onEdit
}: WorkflowStepProps) {
  const isBlocked = status === 'blocked';
  const isAvailable = status === 'available' || status === 'completed';
  
  const handleClick = () => {
    if (!isAvailable) return;
    status === 'completed' ? onEdit(id) : onLaunch(id);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable) return;
    handleClick();
  };

  return (
    <div className="group">
      <div 
        className={`flex items-center space-x-4 p-3 rounded-lg border transition-all duration-200 ${
          isBlocked 
            ? 'border-red-200 bg-red-50/30 cursor-not-allowed' 
            : isAvailable
            ? 'border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 cursor-pointer'
            : 'border-gray-100 bg-gray-50/30 cursor-not-allowed'
        }`}
        onClick={handleClick}
      >
        <StatusIcon status={status} color={color} />
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon className={`w-4 h-4 ${isBlocked ? 'text-red-400' : 'text-gray-500'}`} />
              <div>
                <h4 className={`font-medium text-sm ${
                  isBlocked 
                    ? 'text-red-700' 
                    : isAvailable 
                    ? 'text-gray-900 group-hover:text-blue-900' 
                    : 'text-gray-500'
                }`}>
                  {title}
                </h4>
                <p className={`text-xs mt-0.5 ${
                  isBlocked ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {blockReason || description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {status === 'completed' && (
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                  Terminé
                </span>
              )}
              {status === 'blocked' && (
                <div className="flex items-center space-x-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                  <span>Bloqué</span>
                </div>
              )}
              {isAvailable && (
                <button 
                  onClick={handleButtonClick}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  title={status === 'completed' ? 'Modifier le résultat' : 'Lancer l\'outil'}
                >
                  {status === 'completed' ? (
                    <Settings className="w-4 h-4" />
                  ) : (
                    <PlayCircle className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}