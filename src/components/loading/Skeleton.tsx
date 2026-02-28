"use client";

import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: string;
}

export function Skeleton({ className = "", width, height, rounded = "rounded-lg" }: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div 
      className={`shimmer ${rounded} ${className}`}
      style={style}
    />
  );
}

interface ScoreSkeletonProps {
  compact?: boolean;
}

export function ScoreSkeleton({ compact = false }: ScoreSkeletonProps) {
  const spacing = compact ? "space-y-4" : "space-y-6";
  
  return (
    <div className={spacing}>
      {/* Score Overview */}
      <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
        <div className="flex items-baseline gap-4">
          <Skeleton width={compact ? 80 : 120} height={compact ? 48 : 72} rounded="rounded-2xl" />
          <div className="space-y-2">
            <Skeleton width={40} height={16} />
            <Skeleton width={50} height={16} />
          </div>
        </div>
        <div className="flex-1 space-y-4 pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton width={60} height={12} />
                <Skeleton width={30} height={12} />
              </div>
              <Skeleton height={8} rounded="rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Gaps */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Skeleton width={80} height={12} />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={50} rounded="rounded-xl" />
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton width={60} height={12} />
          {[1, 2].map((i) => (
            <Skeleton key={i} height={50} rounded="rounded-xl" />
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        <Skeleton width={100} height={12} />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={60} rounded="rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

interface TextSkeletonProps {
  lines?: number;
  width?: string;
}

export function TextSkeleton({ lines = 4, width = "100%" }: TextSkeletonProps) {
  return (
    <div className="space-y-3" style={{ width }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          height={16} 
          rounded="rounded-lg"
          className={i === lines - 1 ? "w-3/4" : ""}
        />
      ))}
    </div>
  );
}

interface CardSkeletonProps {
  title?: string;
}

export function CardSkeleton({ title }: CardSkeletonProps) {
  return (
    <div className="glass-panel p-6 sm:p-8 rounded-[2rem] space-y-6">
      {title && <Skeleton width={120} height={14} />}
      <div className="space-y-4">
        <Skeleton height={160} rounded="rounded-2xl" />
        <div className="flex gap-4">
          <Skeleton height={44} className="flex-1" rounded="rounded-xl" />
          <Skeleton height={44} className="flex-1" rounded="rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function CoverLetterSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton width={12} height={12} rounded="rounded-full" />
          <Skeleton width={150} height={12} />
        </div>
        <Skeleton width={80} height={32} rounded="rounded-lg" />
      </div>
      <div className="space-y-3 p-6 md:p-8 rounded-2xl border border-[#1e2530] bg-[#12151a]/30">
        <TextSkeleton lines={8} />
      </div>
    </div>
  );
}

export function TipsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 p-5 rounded-2xl border border-[#1e2530] bg-[#12151a]/30">
          <Skeleton width={28} height={28} rounded="rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton height={16} width="80%" />
            <Skeleton height={16} width="60%" />
          </div>
        </div>
      ))}
    </div>
  );
}
