const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

const normalizeBaseUrl = (): string => API_BASE_URL.replace(/\/+$/, '');

export const buildApiUrl = (path: string): string => {
  const baseUrl = normalizeBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

export const resolveImageUrl = (imageUrl?: string): string => {
  if (!imageUrl || imageUrl.trim() === '') {
    return '';
  }

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  const baseUrl = normalizeBaseUrl();

  if (imageUrl.startsWith('/')) {
    return `${baseUrl}${imageUrl}`;
  }

  return `${baseUrl}/uploads/games/${imageUrl}`;
};
