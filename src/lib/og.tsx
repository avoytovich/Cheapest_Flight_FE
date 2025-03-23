import { ImageResponse } from 'next/og';

export const generateImage = (title: string) => {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          color: '#fff',
          background: '#000',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {title}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
};
