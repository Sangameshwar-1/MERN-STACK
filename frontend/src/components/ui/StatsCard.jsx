import React from 'react';
import { Card, CardContent } from './Card';

export const StatsCard = ({ title, value, icon: Icon, description }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-zinc-400">{title}</h3>
          {Icon && <Icon className="h-4 w-4 text-zinc-500" />}
        </div>
        <div className="text-2xl font-bold text-zinc-100">{value}</div>
        {description && <p className="text-xs text-zinc-500 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
};