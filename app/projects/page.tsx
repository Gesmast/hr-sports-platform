import { Metadata } from 'next';
import { projects } from '@/data/projects';
import { FilterTabs } from '@/components/projects/FilterTabs';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { SectionHeading } from '@/components/shared/SectionHeading';

export const metadata: Metadata = {
  title: 'Production Case Studies & Client Portfolios — HR Sports',
  description: 'Explore custom sportswear, pro tournament jerseys, corporate uniforms, and technical activewear manufactured by HR Sports for global clients.',
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = 'all' } = await searchParams;

  const filteredProjects = category === 'all'
    ? projects
    : projects.filter((p) => p.category === category);

  return (
    <main className="min-h-screen py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="OEM Production Vault"
          title="Manufacturing Case Studies & Client Collections."
          description="From European pro football leagues to boutique American compression lines, explore our verified manufacturing portfolio with full fabric specifications and production volumes."
        />

        {/* Filter Navigation */}
        <div className="mb-10">
          <FilterTabs />
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-surface border-hairline border-border rounded-base p-8">
            <p className="text-sm font-mono text-muted uppercase">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
