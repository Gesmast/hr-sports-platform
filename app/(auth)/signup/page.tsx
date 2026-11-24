import { redirect } from 'next/navigation';

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const queryString = new URLSearchParams();
  queryString.set('mode', 'signup');
  if (params.redirectTo && typeof params.redirectTo === 'string') {
    queryString.set('redirectTo', params.redirectTo);
  }
  redirect(`/login?${queryString.toString()}`);
}
