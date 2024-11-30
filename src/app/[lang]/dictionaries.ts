import "server-only";

export async function getDictionary(locale: string = 'en') {
  switch (locale) {
    case 'af':
      return (await import('./dictionaries/af.json')).default;
    default:
      return (await import('./dictionaries/en.json')).default;
  }
}