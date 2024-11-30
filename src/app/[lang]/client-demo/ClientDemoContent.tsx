'use client';

import { useState } from 'react';
import Link from "next/link";

interface Translations {
  title: string;
  desc: string;
  back: string;
}

interface ClientDemoProps {
  translations: Translations;
}

export default function ClientDemoContent({ translations }: ClientDemoProps) {
  const [count, setCount] = useState(0);

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">{translations.title}</h1>
        <p>{translations.desc}</p>
        <div className="space-y-2">
          <p>Count is: {count}</p>
          <button 
            onClick={() => setCount(count + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Increment
          </button>
        </div>
      </div>
      <Link href="/" className="underline">
        {translations.back}
      </Link>
    </main>
  );
}