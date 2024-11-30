// src/app/[lang]/page.tsx
import { getDictionary } from "./dictionaries";
import Link from "next/link";
import LanguageSwitcher from '@/components/LanguageSwitcher';
import type { Metadata } from "next";
import type { SupportedLanguages } from "@/i18n/types";

interface PageProps {
  params: Promise<{ 
    lang: SupportedLanguages 
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const i18n = await getDictionary(lang);

  return {
    title: i18n.page.title,
    description: i18n.page.desc,
  };
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params;
  const i18n = await getDictionary(lang);
  
  return (
    <main className="flex min-h-screen flex-col items-center gap-6 py-12">
      <LanguageSwitcher currentPath="/" />
      <div>
        <Link href="/client-demo" className="underline">
          {i18n.home["client-demo"]}
        </Link>
      </div>
      <div>
        <Link href="/demo" className="underline">
          {i18n.home.demo}
        </Link>
      </div>
      <p className="fixed left-0 top-0 w-full p-4 text-center border-b bg-gray-100 
        dark:bg-zinc-800 dark:border-neutral-800
        lg:static lg:w-auto lg:rounded-xl lg:border">
        {i18n.home.title}
      </p>
      {i18n.home.desc}
    </main>
  );
}