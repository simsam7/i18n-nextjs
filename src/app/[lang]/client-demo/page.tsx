import { getDictionary } from "../dictionaries";
import { type SupportedLanguages } from "@/i18n/types";
import ClientDemoContent from './ClientDemoContent';

interface PageProps {
  params: Promise<{ 
    lang: SupportedLanguages 
  }>;
}

export default async function ClientDemoPage({ params }: PageProps) {
  const { lang } = await params;
  const i18n = await getDictionary(lang);

  return (
    <ClientDemoContent 
      translations={{
        title: i18n.demo.title,
        desc: i18n.demo.desc,
        back: i18n.demo.back
      }} 
    />
  );
}