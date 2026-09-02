import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Quote } from 'lucide-react';
import { projects } from '@/data/projects';
import { GalleryLightbox } from '@/components/projects/GalleryLightbox';
import { BorderCard } from '@/components/shared/BorderCard';
import { Button } from '@/components/shared/Button';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({
    id: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.slug === id || p.id === id);

  if (!project) {
    return {
      title: 'Project Not Found | HR Sports',
    };
  }

  return {
    title: `${project.title} — OEM Manufacturing Case Study | HR Sports`,
    description: project.summary,
    openGraph: {
      title: `${project.title} | HR Sports`,
      description: project.summary,
      images: [{ url: project.thumbnailUrl }],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const project = projects.find((p) => p.slug === id || p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Case Studies
          </Link>
        </div>

        {/* Header Title */}
        <div className="max-w-4xl mb-12">
          <div className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-muted mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-ink" />
            {project.categoryLabel} • Client: {project.client} ({project.year})
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink leading-tight">
            {project.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Split Grid: Narrative & Gallery vs Sticky Spec Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Narrative, Gallery, Testimonial */}
          <div className="lg:col-span-8 space-y-12">
            {/* High Res Gallery */}
            <div>
              <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-ink mb-4">
                01 / Production Gallery & Construction Details
              </h2>
              <GalleryLightbox images={project.gallery} title={project.title} />
            </div>

            {/* Case Study Narrative: Challenge & Solution */}
            <div className="space-y-6 pt-6 border-t border-hairline border-border-light">
              <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-ink">
                02 / Manufacturing Challenge & Engineering Execution
              </h2>

              <div className="p-6 bg-surface border-hairline border-border rounded-base space-y-3">
                <h3 className="text-base font-extrabold text-ink">The Client Challenge:</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              <div className="p-6 bg-white border-hairline border-border rounded-base space-y-3">
                <h3 className="text-base font-extrabold text-ink">The HR Sports Solution:</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Verified Testimonial Block */}
            {project.testimonial && (
              <div className="pt-6 border-t border-hairline border-border-light">
                <h2 className="text-sm font-mono uppercase tracking-wider font-bold text-ink mb-4">
                  03 / Verified Client Feedback
                </h2>
                <BorderCard variant="surface" className="p-8 relative">
                  <Quote className="w-8 h-8 text-ink/20 mb-4" />
                  <blockquote className="text-lg font-medium text-ink leading-relaxed italic mb-6">
                    &ldquo;{project.testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-between border-t border-border-light pt-4 text-xs font-mono">
                    <div>
                      <span className="font-bold text-ink block">{project.testimonial.author}</span>
                      <span className="text-muted">{project.testimonial.role} — {project.testimonial.company}</span>
                    </div>
                    <div className="text-right text-muted hidden sm:block">
                      {project.testimonial.location}
                    </div>
                  </div>
                </BorderCard>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Sidebar Spec Card */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <BorderCard variant="default" className="p-6 space-y-6 shadow-sm">
              <div className="border-b border-border-light pb-4">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted">
                  Factory Audit Sheet
                </div>
                <h3 className="text-xl font-extrabold text-ink tracking-tight mt-1">
                  Batch Specifications
                </h3>
              </div>

              {/* Specs Table */}
              <div className="space-y-3 text-xs">
                {project.specs.map((spec, idx) => (
                  <div key={idx} className="flex justify-between items-start pb-2 border-b border-border-light">
                    <span className="text-muted font-mono">{spec.label}:</span>
                    <span className="font-bold text-ink text-right max-w-[170px]">{spec.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-start pb-2 border-b border-border-light">
                  <span className="text-muted font-mono">Fabrics Milled:</span>
                  <div className="text-right max-w-[170px] font-semibold text-ink">
                    {project.fabricsUsed.map((f, i) => (
                      <span key={i} className="block">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span className="text-muted font-mono">Volume Batch:</span>
                  <span className="font-bold text-ink">{project.productionVolume}</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <Link
                  href={`/request-a-quote?garment=${encodeURIComponent(project.title)}&source=${encodeURIComponent(project.id)}`}
                  className="block"
                >
                  <Button variant="primary" size="lg" className="w-full gap-2">
                    Request Similar Project
                    <ArrowRight className="w-4 h-4 stroke-[2]" />
                  </Button>
                </Link>
                <p className="text-[11px] font-mono text-muted text-center mt-2.5">
                  24-Hour Quote SLA • Physical Sample Guaranteed
                </p>
              </div>
            </BorderCard>

            {/* Quality Seal Box */}
            <div className="p-4 bg-surface border-hairline border-border rounded-base text-xs font-mono text-muted space-y-2">
              <div className="flex items-center gap-2 text-ink font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>NDA & Client IP Protected</span>
              </div>
              <p className="text-[11px] leading-normal">
                Pattern geometry and color profiles for this project are securely archived under mutual non-disclosure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
