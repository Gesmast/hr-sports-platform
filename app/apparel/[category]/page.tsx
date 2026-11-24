import { redirect } from 'next/navigation';

interface ApparelCategoryProps {
  params: Promise<{ category: string }>;
}

export default async function ApparelCategoryRedirect({ params }: ApparelCategoryProps) {
  const { category } = await params;
  redirect(`/styles/${category}`);
}
