import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="text-center p-4 bg-gray-400 py-4">
      <p className="text-sm text-gray-700">
        Copyright &copy; 2025 Created by{' '}
        <Link
          href="https://portfolio-five-delta-66.vercel.app"
          className="text-blue-900 underline"
        >
          Andrii
        </Link>
      </p>
    </footer>
  );
}
