# Uni-Art — сайт-визитка творческого объединения

Одностраничный сайт кинопродакшна с отдельными страницами проектов.
Next.js 16 (App Router) + Tailwind CSS 4, собирается в статику и раздаётся
Cloudflare — без сервера, бесплатно.

## Что внутри

- главный экран с шоурилом в модальном окне (YouTube/Vimeo);
- портфолио с фильтром по типу проекта и отдельной страницей под каждый проект;
- услуги, этапы работы, команда, бегущая строка клиентов;
- форма заявки (Formspree/Getform/свой воркер или fallback на почтовый клиент);
- физический коллаж из киноатрибутики: предметы падают в кадр, сталкиваются,
  их можно швырять мышью или пальцем, а на телефоне — управлять наклоном;
- SEO: метатеги, Open Graph, JSON-LD (Organization), `sitemap.xml`, `robots.txt`;
- тёмная кинематографичная тема, адаптив, поддержка `prefers-reduced-motion`.

## Быстрый старт

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # статика в ./out
npm run lint
```

## Как наполнить сайт

Весь контент лежит в одном файле — [`src/content/site.ts`](src/content/site.ts).
Там же помечены плейсхолдеры комментарием `// TODO`. Менять нужно:

| Что | Где |
| --- | --- |
| Название, слоган, описание | `site.name`, `site.tagline`, `site.heroTitle` |
| Контакты и соцсети | `site.email`, `site.phone`, `site.city`, `site.socials` |
| Шоурил | `site.showreelUrl` — **embed-ссылка** (`https://www.youtube.com/embed/ID`) |
| Видео-фон главного экрана | `site.heroVideo` — путь к mp4 в `public/` (пусто → статичный постер) |
| Проекты | массив `projects` |
| Услуги, этапы, команда, клиенты | `services`, `processSteps`, `team`, `clients` |
| Цифры под главным экраном | `stats` |
| Предметы в коллаже | `src/content/props.ts`, картинки в `public/props/` |

Картинки кладите в `public/`: постеры проектов — `public/posters/`,
фото команды — любой путь внутри `public/`, он же указывается в `photo`.
Сейчас в `public/posters/` лежат SVG-заглушки — замените их на настоящие кадры
(рекомендуемый размер 1600×900, jpg или webp).

Фирменные цвета и шрифты — в `src/app/globals.css` (переменные `--accent`,
`--bg`, `--fg`) и в `src/app/layout.tsx` (`Inter` + `Oswald`).

## Переменные окружения

Скопируйте `.env.example` в `.env.local` для локальной разработки и задайте те же
переменные в настройках Cloudflare (Build variables):

- `NEXT_PUBLIC_SITE_URL` — боевой домен, используется в canonical, OG и sitemap;
- `NEXT_PUBLIC_FORM_ENDPOINT` — URL приёма заявок (Formspree, Getform, Web3Forms,
  собственный Cloudflare Worker). Если не задан, форма откроет почтовый клиент
  с уже заполненным письмом — сайт остаётся рабочим, но заявки приходят вручную.

## Деплой на Cloudflare

Сайт деплоится на **Cloudflare Workers со статическими ассетами**: `npm run build`
собирает статику в `out/`, `npx wrangler deploy` раздаёт эту папку.
Настройки деплоя лежат в [`wrangler.jsonc`](wrangler.jsonc).

Поле `name` в `wrangler.jsonc` должно совпадать с именем Worker'а в дашборде
Cloudflare — иначе деплой уедет в другой (или новый) Worker.

Подключение через Workers Builds (Cloudflare Dashboard → **Workers & Pages** →
**Import a repository**):

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`

Переменные окружения задаются в **Settings → Variables and Secrets**. Переменные
с префиксом `NEXT_PUBLIC_` нужны на этапе сборки, поэтому добавлять их надо
в **Build variables**, а не только в рантайм-переменные.

Заголовки кеширования и безопасности лежат в [`public/_headers`](public/_headers) —
Next копирует файл в `out/`, Cloudflare применяет его сам.

Свой домен подключается в **Settings → Domains & Routes**.

<details>
<summary>Альтернатива: Cloudflare Pages</summary>

Проект собирается и на Pages без изменений в коде: Build command `npm run build`,
Build output directory `out`, `NODE_VERSION=22`. `wrangler.jsonc` в этом случае
не используется. Для новых проектов Cloudflare рекомендует Workers.

</details>

## Структура

```
src/
  app/
    layout.tsx           общий каркас, шрифты, метатеги
    page.tsx             главная страница
    works/[slug]/        страницы проектов (генерируются из projects)
    privacy/             политика конфиденциальности (ТРЕБУЕТ ПРАВКИ ЮРИСТА)
    sitemap.ts robots.ts
  components/            секции главной и переиспользуемые блоки
  content/site.ts        ВЕСЬ контент сайта
public/posters/          постеры проектов (сейчас — заглушки)
```
