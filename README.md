# Next.js i18n Example

A demonstration of internationalization (i18n) in Next.js using App Router, showcasing both server and client components with language switching capabilities.

## Features

- 🌐 Server-side language detection
- 🔄 Dynamic language switching
- 🎨 Clean URLs for default language
- 🖥️ Both server and client component examples
- 📱 SEO-friendly implementation
- 🛡️ Type-safe translations with TypeScript

## Implementation Details

### Routing Structure

The app uses Next.js App Router with dynamic route parameters for language:

```
src/app/
  ├── [lang]/
  │   ├── layout.tsx      # Base layout with language handling
  │   ├── page.tsx        # Home page
  │   ├── demo/           # Server component example
  │   │   └── page.tsx
  │   ├── client-demo/    # Client component example
  │   │   ├── page.tsx
  │   │   └── ClientDemoContent.tsx
  │   └── dictionaries.ts # Translation files
  └── middleware.ts       # Language detection and routing
```

### Key Features

1. **Clean URLs**: Default language routes don't show language prefix
   - `/` instead of `/en`
   - `/demo` instead of `/en/demo`
   - Non-default languages show prefix: `/af/demo`

2. **Language Detection**:
   - Checks browser's `Accept-Language` header
   - Persists choice in cookies
   - Redirects based on user preference

3. **SEO Optimization**:
   - Server-side rendering for all pages
   - Proper language tags in HTML
   - Clean URL structure

4. **Type Safety**:
   - Full TypeScript implementation
   - Type-safe translations
   - Shared language type definitions

## Usage

### Adding a New Language

1. Add the language code to `src/i18n/types.ts`:
```typescript
export const locales = ["en", "af", "your-language-code"] as const;
```

2. Create translations in your dictionary file:
```typescript
export const dictionaries = {
  en: { ... },
  af: { ... },
  "your-language-code": { ... }
};
```

### Adding New Pages

Pages automatically inherit language support. Example:

```typescript
interface PageProps {
  params: Promise<{ 
    lang: SupportedLanguages 
  }>;
}

export default async function YourPage({ params }: PageProps) {
  const { lang } = await params;
  const i18n = await getDictionary(lang);

  return (
    <div>{i18n.yourPage.title}</div>
  );
}
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the application in action.

## License

The Unlicense