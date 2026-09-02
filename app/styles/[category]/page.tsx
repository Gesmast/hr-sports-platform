import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { styleCategories } from '@/data/styles';
import { StyleCategoryProductList } from './StyleCategoryProductList';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return styleCategories.map((c) => ({
    category: c.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = styleCategories.find((c) => c.slug === slug || c.id === slug);

  if (!category) {
    return {
      title: 'Category Not Found | HR Sports',
    };
  }

  return {
    title: `Custom ${category.name} Manufacturing — Styles & Materials | HR Sports`,
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
  const category = styleCategories.find((c) => c.slug === slug || c.id === slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 md:py-20 bg-white">
      <StyleCategoryProductList category={category} />
    </main>
  );
}
