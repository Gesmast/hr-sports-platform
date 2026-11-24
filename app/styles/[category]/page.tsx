import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { styleCategories } from '@/data/styles';
import { StyleCategoryProductList } from './StyleCategoryProductList';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

function findCategoryBySlug(slug: string) {
  const normalized = slug.toLowerCase();
  return styleCategories.find(
    (c) =>
      c.slug === normalized ||
      c.id === normalized ||
      (normalized === 'soccer-football' && c.slug === 'football') ||
      (normalized === 'soccer' && c.slug === 'football') ||
      (normalized === 'activewear' && c.slug === 'gym-activewear') ||
      (normalized === 'ice-hockey' && c.slug === 'hockey') ||
      (normalized === 'corporate' && c.slug === 'corporate-uniforms') ||
      (normalized === 'security' && c.slug === 'security-uniforms') ||
      (normalized === 'promotional' && c.slug === 'promotional-uniforms')
  );
}

export async function generateStaticParams() {
  const slugs = styleCategories.map((c) => ({ category: c.slug }));
  const legacyAliases = [
    { category: 'soccer-football' },
    { category: 'activewear' },
    { category: 'ice-hockey' },
    { category: 'corporate' },
    { category: 'security' },
    { category: 'promotional' },
  ];
  return [...slugs, ...legacyAliases];
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = findCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found | HR Sports',
    };
  }

  return {
    title: `Custom ${category.name} Manufacturing (Coming Soon) | HR Sports`,
    description: category.description,
    openGraph: {
      title: `Custom ${category.name} | HR Sports OEM`,
      description: category.description,
      images: [{ url: category.imageUrl }],
    },
  };
}

export default async function CategoryDetailPage({
  params,
}: CategoryPageProps) {
  const { category: slug } = await params;
  const category = findCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 md:py-20 bg-white">
      <StyleCategoryProductList category={category} />
    </main>
  );
}
