import React from 'react';

const SkeletonCard = ({ className }) => (
  <div className={`card p-5 border-brand-500/5 ${className}`}>
    <div className="flex justify-between items-start mb-3">
      <div className="h-3 w-24 skeleton rounded"></div>
      <div className="h-4 w-4 skeleton rounded"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 w-full skeleton rounded"></div>
      <div className="h-4 w-5/6 skeleton rounded"></div>
      <div className="h-4 w-4/6 skeleton rounded"></div>
    </div>
  </div>
);

const SkeletonResult = () => {
  return (
    <div className="w-full mt-6 animate-pulse">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full skeleton"></div>
          <div className="h-6 w-48 skeleton rounded"></div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-none h-10 w-24 skeleton rounded-md"></div>
          <div className="flex-2 sm:flex-none h-10 w-32 skeleton rounded-md"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-2">
          <SkeletonCard className="h-40" />
        </div>
        <SkeletonCard className="h-40" />
        <SkeletonCard className="h-40" />
        
        <div className="md:col-span-2 lg:col-span-1 xl:col-span-2">
          <SkeletonCard className="h-48" />
        </div>
        <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
          <SkeletonCard className="h-48" />
        </div>
        
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-3">
          <SkeletonCard className="h-56" />
        </div>
        
        <SkeletonCard className="h-56" />
        
        <div className="md:col-span-2 lg:col-span-3 xl:col-span-4">
          <SkeletonCard className="h-32" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonResult;
