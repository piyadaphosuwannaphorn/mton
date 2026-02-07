import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// ชื่อ repo ของคุณคือ mton → base ต้องเป็น '/mton/'
export default defineConfig(({ mode }) => {
  // โหลด env จากไฟล์ .env*, และ expose เฉพาะตัวที่ขึ้นต้นด้วย VITE_
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/mton/', // สำคัญสำหรับ GitHub Pages
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    // ✨ ไม่ต้อง define process.env เอง ให้ใช้ import.meta.env ในโค้ดแทน
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});