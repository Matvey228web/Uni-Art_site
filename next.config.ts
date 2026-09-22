import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Статический экспорт: `npm run build` кладёт готовый сайт в ./out.
   * Cloudflare раздаёт эту папку как статические ассеты Worker'а.
   */
  output: "export",
  // Пути вида /works/slug/ — так Cloudflare отдаёт index.html без редиректов.
  trailingSlash: true,
  // Оптимизатор картинок Next требует сервера, в статике его нет.
  images: { unoptimized: true },
};

export default nextConfig;
