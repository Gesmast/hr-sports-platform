import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { styleCategories } from '@/data/styles';
import { StyleCategoryProductList } from '@/app/styles/[category]/StyleCategoryProductList';

interface UniformSubcategoryPageProps {
  params: Promise<{ subcategory: string }>;
}

function findUniformSubcategory(slug: string) {
  const normalized = slug.toLowerCase();
  return styleCategories.find(
    (c) =>
      c.slug === normalized ||
      c.id === normalized ||
      (normalized === 'corporate' && c.slug === 'corporate-uniforms') ||
      (normalized === 'security' && c.slug === 'security-uniforms') ||
      (normalized === 'promotional' && c.slug === 'promotional-uniforms')
  );
}

export async function generateStaticParams() {
  const uniformSlugs = ['corporate-uniforms', 'security-uniforms', 'promotional-uniforms'];
  const legacyAliases = ['corporate', 'security', 'promotional'];
  return [...uniformSlugs, ...legacyAliases].map((slug) => ({ subcategory: slug }));
}

export async function generateMetadata({
  params,
}: UniformSubcategoryPageProps): Promise<Metadata> {
  const { subcategory: slug } = await params;
  const category = findUniformSubcategory(slug);

  if (!category) {
    return {
      title: 'Uniform Category Not Found | HR Sports',
    };
  }

  return {
    title: `Custom ${category.name} Manufacturing | Uniforms | HR Sports`,
    description: category.description,
    openGraph: {
      title: `Custom ${category.name} | HR Sports OEM`,
      description: category.description,
      images: [{ url: category.imageUrl }],
    },
  };
}

export default async function UniformSubcategoryPage({
  params,
}: UniformSubcategoryPageProps) {
  const { subcategory: slug } = await params;
  const category = findUniformSubcategory(slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 md:py-20 bg-white">
      <StyleCategoryProductList category={category} />
    </main>
  );
}
