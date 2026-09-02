import React from 'react';
import Link from 'next/link';
import { ArrowRight, Layers, Clock, Award } from 'lucide-react';
import { Project } from '@/types';
import { BorderCard } from '@/components/shared/BorderCard';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link href={`/projects/${project.slug}`} className="group block h-full">
      <BorderCard
        variant="surface"
        className="flex flex-col justify-between p-5 sm:p-6 h-full transition-all duration-200 group-hover:border-ink group-hover:bg-white"
      >
        <div>
          {/* Thumbnail Container */}
          <div className="relative w-full aspect-16/10 rounded-base overflow-hidden border-hairline border-border-light mb-5 bg-zinc-900">
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 bg-ink text-white px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm">
              {project.categoryLabel}
            </div>
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-ink px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-sm border-hairline border-border">
              {project.productionVolume}
            </div>
          </div>

          {/* Title & Client */}
          <div className="text-[11px] font-mono uppercase text-muted tracking-wider mb-1">
            {project.client}
          </div>
          <h3 className="text-xl font-extrabold text-ink tracking-tight mb-2.5 group-hover:underline">
            {project.title}
          </h3>
          <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-5">
            {project.summary}
          </p>

          {/* Hover Spec Overlay Details */}
          <div className="bg-white border-hairline border-border-light rounded-base p-3.5 space-y-2 text-xs mb-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-muted">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-ink" />
                Fabrics Used:
              </span>
              <span className="font-semibold text-ink truncate max-w-[160px] text-right">
                {project.fabricsUsed[0].split('(')[0]}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-muted border-t border-border-light pt-1.5">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-ink" />
                Turnaround:
              </span>
              <span className="font-semibold text-ink">
                {project.durationWeeks}
              </span>
            </div>
          </div>
        </div>

        {/* Action Link */}
        <div className="pt-2 text-xs font-mono font-bold uppercase tracking-wider text-ink flex items-center justify-between border-t border-border-light">
          <span>Inspect Case Study</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </BorderCard>
    </Link>
  );
};

export default ProjectCard;
