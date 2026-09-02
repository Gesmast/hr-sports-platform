import React from 'react';
import { teamMembers } from '@/data/team';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { BorderCard } from '@/components/shared/BorderCard';

export const TeamGrid: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-hairline border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Leadership & Engineering"
          title="Master Craftsmen & Textile Technicians."
          description="Our leadership pairs decades of industrial export manufacturing experience with modern 3D CAD pattern modeling and chemical color science."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {teamMembers.map((member) => (
            <BorderCard key={member.id} variant="surface" hoverEffect className="p-6">
              <div className="relative w-full aspect-square rounded-base overflow-hidden border-hairline border-border-light mb-4 bg-zinc-200">
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="w-full h-full object-cover grayscale-20 hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute top-3 right-3 bg-ink text-white px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-sm">
                  {member.experienceYears} Years Exp.
                </div>
              </div>

              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted mb-1">
                {member.department}
              </div>
              <h3 className="text-lg font-extrabold text-ink tracking-tight">
                {member.name}
              </h3>
              <div className="text-xs font-semibold text-ink/80 mb-3">
                {member.role}
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {member.bio}
              </p>
            </BorderCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamGrid;
