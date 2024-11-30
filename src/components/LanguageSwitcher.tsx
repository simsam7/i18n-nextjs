// components/LanguageSwitcher.tsx
import Link from 'next/link';

type Props = {
  currentPath: string;
}

export default function LanguageSwitcher({ currentPath }: Props) {
  // Remove locale prefix if present
  const path = currentPath.replace(/^\/[a-z]{2}/, '') || '/';
  
  return (
    <div className="space-x-2">
      <Link href={`/lang/en${path}`}>English</Link>
      <span>|</span>
      <Link href={`/lang/af${path}`}>Afrikaans</Link>
    </div>
  );
}