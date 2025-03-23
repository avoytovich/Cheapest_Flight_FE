import { generateImage } from '@/lib/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Default Title';

  const imageResponse = generateImage(title);
  const imageBlob = await imageResponse.blob();

  return new Response(imageBlob, {
    headers: {
      'Content-Type': 'image/svg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
