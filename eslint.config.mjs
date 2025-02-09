import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Creating a configuration array that includes the core Next.js settings and Prettier.
const eslintConfig = compat.extends(
  'next/core-web-vitals', // Next.js recommended rules
  'next/typescript', // TypeScript support
  'plugin:prettier/recommended' // Prettier integration
);

export default eslintConfig;
