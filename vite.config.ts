import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    // 設定為 './' 是部署到 GitHub Pages 的關鍵
    // 這確保了資源引用使用相對路徑，而不是絕對路徑 (e.g., /assets/...)
    // 這樣無論你的 repo 名稱是什麼，都能正確載入
    base: './',
    define: {
      // 在 build time 將 process.env.API_KEY 替換為實際的值
      // 注意：部署到公開的 GitHub Pages 會暴露此 Key
      // 建議在 Google Cloud Console 對此 Key 設定 HTTP Referrer 限制
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});