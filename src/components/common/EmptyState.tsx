import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-14 text-center">
    {icon && <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-soft text-muted">{icon}</div>}
    <h2 className="text-lg font-semibold">{title}</h2>
    {description && <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);
