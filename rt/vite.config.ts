// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'], // Форматы отчетов
      include: ['src/**/*.{js,ts,jsx,tsx}'], // Включаемые файлы
      exclude: ['node_modules', 'test'], // Исключаемые файлы и директории
    },
  },
});
