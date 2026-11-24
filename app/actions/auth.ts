'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export interface AuthActionResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function signInWithPassword(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirectTo') as string) || '/portal';

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect(redirectTo);
}

export async function signUpWithPassword(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const companyName = formData.get('companyName') as string;
  const redirectTo = (formData.get('redirectTo') as string) || '/portal';

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  if (password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters.' };
  }

  const supabase = await createClient();

  // On sign-up, Supabase sends confirmation link to user email
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      data: {
        full_name: fullName || '',
        company_name: companyName || '',
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // If email confirmation is enabled, user session won't be active immediately
  if (data.user && !data.session) {
    return {
      success: true,
      message: 'Account created! Please check your email and click the confirmation link to sign in.',
    };
  }

  revalidatePath('/', 'layout');
  redirect(redirectTo);
}

export async function signInWithGoogle(redirectTo: string = '/portal') {
  const supabase = await createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${appUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { success: false, error: 'Could not generate Google OAuth login URL.' };
}

export async function forgotPassword(formData: FormData): Promise<AuthActionResult> {
  const email = formData.get('email') as string;

  if (!email) {
    return { success: false, error: 'Please enter your corporate email address.' };
  }

  const supabase = await createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    message: 'If an account exists with this email, a password recovery link has been sent.',
  };
}

export async function resetPassword(formData: FormData): Promise<AuthActionResult> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters long.' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/portal');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
