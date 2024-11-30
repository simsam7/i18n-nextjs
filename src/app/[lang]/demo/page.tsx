import { getDictionary } from "../dictionaries";
import Link from "next/link";
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
    title: `${i18n.demo.title} - Demo`,
    description: i18n.demo.desc,
  };
}

export default async function DemoPage({ params }: PageProps) {
  const { lang } = await params;
  const i18n = await getDictionary(lang);

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">{i18n.demo.title}</h1>
        <p>{i18n.demo.desc}</p>
      </div>
      <Link href="/" className="underline">
        {i18n.demo.back}
      </Link>
    </main>
  );
}