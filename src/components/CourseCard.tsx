import React from 'react';
import { Star, Clock, User, Landmark, ShieldCheck } from 'lucide-react';
import { Course } from '../types';

interface CourseCardProps {
  key?: React.Key;
  course: Course;
  isArabic: boolean;
  onSelect: () => void;
  isEnrolled: boolean;
}

export default function CourseCard({ course, isArabic, onSelect, isEnrolled }: CourseCardProps) {
  return (
    <div 
      id={`course-card-${course.id}`}
      onClick={onSelect}
      className="group relative bg-slate-950/45 border border-slate-900 rounded-2xl overflow-hidden hover:border-cyan-500/40 hover:bg-slate-950/80 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none"
    >
      {/* Laser neon line gradient hover overlay */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Card Content layouts */}
      <div className="space-y-4">
        {/* Thumbnail banner */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-950 border-b border-slate-900/60">
          <img 
            src={course.thumbnail} 
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105" 
            alt={course.title} 
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {/* Difficulty markers */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="bg-slate-950/85 backdrop-blur-sm border border-slate-800 text-[9px] font-mono uppercase text-slate-300 px-2 py-0.5 rounded-full">
              {course.difficulty}
            </span>
          </div>

          {/* Enrolled Badge banner */}
          {isEnrolled && (
            <div className="absolute top-3 right-3 bg-emerald-500/90 text-black font-sans font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg shadow-emerald-500/10 border border-emerald-400">
              <ShieldCheck className="w-3 h-3 stroke-[2.5]" /> Enrolled
            </div>
          )}
        </div>

        {/* Info detailings */}
        <div className="px-5 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
            <span className="bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-500/15 uppercase font-semibold">
              {course.category}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" /> {course.duration}
            </span>
          </div>

          <h3 className="text-sm md:text-base font-sans font-extrabold text-white leading-snug group-hover:text-cyan-300 transition-colors">
            {isArabic ? course.arabicTitle : course.title}
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
            {isArabic ? course.arabicDescription : course.description}
          </p>
        </div>
      </div>

      {/* Card Footers (ratings + pricing) */}
      <div className="px-5 pb-5 pt-3.5 mt-4 border-t border-slate-900/70 flex items-center justify-between">
        {/* review metrics */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-mono font-bold">{course.rating}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">({course.reviewsCount.toLocaleString()})</span>
        </div>

        {/* Course prices tags */}
        <div className="text-right space-y-0.5">
          <div className="text-[10.5px] font-mono flex flex-col items-end gap-0.5">
            <span className="text-emerald-400 font-black tracking-wide">{course.price} EGP (ج.م)</span>
            <div className="flex items-center gap-1 text-[9px] text-slate-400">
              <span className="text-indigo-400 font-medium">{Math.round(course.price / 13.3)} SAR (ر.س)</span>
              <span>•</span>
              <span className="text-sky-400 font-medium">${Math.round(course.price / 50)} USD ($)</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 justify-end text-[9px] font-mono text-slate-600">
            <span>{isArabic ? "سعر الشطب:" : "Original:"}</span>
            <span className="line-through">{course.originalPrice} EGP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
