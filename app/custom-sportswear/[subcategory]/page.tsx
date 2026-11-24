import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { styleCategories } from '@/data/styles';
import { StyleCategoryProductList } from '@/app/styles/[category]/StyleCategoryProductList';

interface SubcategoryPageProps {
  params: Promise<{ subcategory: string }>;
}

function findSportswearSubcategory(slug: string) {
  const normalized = slug.toLowerCase();
  return styleCategories.find(
    (c) =>
      c.slug === normalized ||
      c.id === normalized ||
      (normalized === 'soccer-football' && c.slug === 'football') ||
      (normalized === 'soccer' && c.slug === 'football') ||
      (normalized === 'activewear' && c.slug === 'gym-activewear') ||
      (normalized === 'ice-hockey' && c.slug === 'hockey')
  );
}

export async function generateStaticParams() {
  const sportswearSlugs = ['cricket', 'football', 'basketball', 'gym-activewear', 'hockey'];
  const legacyAliases = ['soccer-football', 'soccer', 'activewear', 'ice-hockey'];
  return [...sportswearSlugs, ...legacyAliases].map((slug) => ({ subcategory: slug }));
}

export async function generateMetadata({
  params,
}: SubcategoryPageProps): Promise<Metadata> {
  const { subcategory: slug } = await params;
  const category = findSportswearSubcategory(slug);

  if (!category) {
    return {
      title: 'Sportswear Category Not Found | HR Sports',
    };
  }

  return {
    title: `Custom ${category.name} Manufacturing | Custom Sportswear | HR Sports`,
    description: category.description,
    openGraph: {
      title: `Custom ${category.name} | HR Sports OEM`,
      description: category.description,
      images: [{ url: category.imageUrl }],
    },
  };
}

export default async function SportswearSubcategoryPage({
  params,
}: SubcategoryPageProps) {
  const { subcategory: slug } = await params;
  const category = findSportswearSubcategory(slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 md:py-20 bg-white">
      <StyleCategoryProductList category={category} />
    </main>
  );
}
