/**
 * Единственный файл, который нужно править, чтобы наполнить сайт.
 * Всё, что помечено TODO, — плейсхолдеры: замените на реальные данные.
 */

export type ProjectCategory =
  | "Реклама"
  | "Клипы"
  | "Короткий метр"
  | "Документальное";

export const projectCategories: ProjectCategory[] = [
  "Реклама",
  "Клипы",
  "Короткий метр",
  "Документальное",
];

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  year: number;
  client?: string;
  role: string;
  duration?: string;
  /** Путь к постеру в /public или внешний URL */
  poster: string;
  /** Ссылка для встраивания: https://www.youtube.com/embed/… или https://player.vimeo.com/video/… */
  video?: string;
  summary: string;
  description: string[];
  credits: { role: string; name: string }[];
};

export type Service = {
  title: string;
  description: string;
  items: string[];
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  /** Путь к фото в /public. Если пусто — покажем инициалы. */
  photo?: string;
};

export const site = {
  name: "UNI-ART",
  legalName: "Творческое объединение «Uni-Art»",
  tagline: "Творческое объединение",
  heroTitle: "Снимаем кино\nи учимся на ходу",
  heroSubtitle:
    "Короткий метр, клипы, документальные зарисовки. Собираемся, придумываем, снимаем — и доводим до конца сами.",
  description:
    "Творческое объединение: снимаем короткий метр, клипы и документальные зарисовки. Небольшой командой, своими силами.",

  // TODO: ссылка на ролик (embed-URL, не обычная ссылка на страницу видео)
  showreelUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  /** Видео-фон главного экрана: путь к mp4 в /public. Пусто — будет постер + градиент. */
  heroVideo: "",
  heroPoster: "/posters/hero.svg",

  // TODO: контакты
  email: "hello@example.com",
  phone: "+7 (000) 000-00-00",
  city: "Москва",
  address: "ул. Примерная, 1", // TODO

  /**
   * Куда отправлять форму заявки. Статический экспорт не умеет обрабатывать
   * формы сам — укажите endpoint (Formspree, Getform, Web3Forms, свой воркер)
   * в переменной NEXT_PUBLIC_FORM_ENDPOINT. Если пусто — форма откроет
   * почтовый клиент с заполненным письмом.
   */
  formEndpoint: process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "",

  /** Домен для canonical-ссылок и OG-тегов. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://creaivas.odintsovmatvey08.workers.dev",

  socials: [
    { label: "Telegram", href: "https://t.me/example" }, // TODO
    { label: "VK", href: "https://vk.com/example" }, // TODO
    { label: "YouTube", href: "https://youtube.com/@example" }, // TODO
    { label: "Behance", href: "https://behance.net/example" }, // TODO
  ],
};

/**
 * Цифры под первым экраном. Пока пусто — полоса не показывается.
 * Заполните, когда будет что поставить честно, например:
 * { value: "9", label: "снятых работ" }
 */
export const stats: { value: string; label: string }[] = [];

export const services: Service[] = [
  {
    title: "Придумываем",
    description: "Идея, сценарий, раскадровка. Обычно спорим, потом сходимся.",
    items: ["Идея", "Сценарий", "Раскадровка"],
  },
  {
    title: "Снимаем",
    description: "Камера, свет, звук. Техника своя и одолженная, команда небольшая.",
    items: ["Съёмка", "Свет", "Звук на площадке"],
  },
  {
    title: "Монтируем",
    description: "Монтаж, цвет, титры. Собираем всё сами, без передачи на сторону.",
    items: ["Монтаж", "Цветокоррекция", "Титры и графика"],
  },
  {
    title: "Пробуем новое",
    description: "Берёмся за то, чего раньше не делали. Иногда получается.",
    items: ["Эксперименты", "Плёнка", "Анимация"],
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Разговор",
    text: "Обсуждаем, что хочется снять, и прикидываем, потянем ли.",
  },
  {
    step: "02",
    title: "Подготовка",
    text: "Сценарий, локации, реквизит, договариваемся, кто что делает.",
  },
  {
    step: "03",
    title: "Съёмка",
    text: "Снимаем. Обычно за одну-две смены, редко дольше.",
  },
  {
    step: "04",
    title: "Сборка",
    text: "Монтаж, цвет, звук. Показываем, правим, выкладываем.",
  },
];

export const projects: Project[] = [
  {
    slug: "severnyy-svet",
    title: "Северный свет",
    category: "Короткий метр",
    year: 2025,
    role: "Сняли сами, от сценария до монтажа",
    duration: "14 мин",
    poster: "/posters/project-1.svg",
    video: "",
    summary: "Короткометражная драма о возвращении домой, снятая за полярным кругом.",
    description: [
      "История о человеке, который возвращается в город детства и обнаруживает, что дом его больше не ждёт.",
      "Снимали 6 смен при естественном свете полярного дня. Камера почти всегда на плече — хотелось, чтобы зритель шёл за героем, а не наблюдал со стороны.",
    ],
    credits: [
      { role: "Режиссёр", name: "Имя Фамилия" },
      { role: "Оператор-постановщик", name: "Имя Фамилия" },
      { role: "Продюсер", name: "Имя Фамилия" },
      { role: "Монтаж", name: "Имя Фамилия" },
    ],
  },
  {
    slug: "reklama-brand",
    title: "Кампания для бренда",
    category: "Реклама",
    year: 2025,
    client: "Клиент",
    role: "Идея, съёмка, монтаж",
    duration: "30 сек",
    poster: "/posters/project-2.svg",
    summary: "Имиджевый ролик и пак вертикальных версий под перформанс-размещение.",
    description: [
      "Задача: показать продукт как часть обычного дня, без глянца и постановочной улыбки.",
      "Сняли за одну смену на трёх локациях, собрали 1 основной ролик и 6 вертикальных нарезок под соцсети.",
    ],
    credits: [
      { role: "Креативный продюсер", name: "Имя Фамилия" },
      { role: "Режиссёр", name: "Имя Фамилия" },
      { role: "Оператор", name: "Имя Фамилия" },
      { role: "Цветокоррекция", name: "Имя Фамилия" },
    ],
  },
  {
    slug: "klip-artist",
    title: "Клип для артиста",
    category: "Клипы",
    year: 2024,
    client: "Артист",
    role: "Режиссура и съёмка",
    duration: "3 мин",
    poster: "/posters/project-3.svg",
    summary: "Одноплановый клип, снятый на складе за шесть дублей.",
    description: [
      "Хотелось уйти от нарезки и сделать один непрерывный проход через все пространства площадки.",
      "Репетировали два дня, сняли за смену. В финальный монтаж вошёл пятый дубль.",
    ],
    credits: [
      { role: "Режиссёр", name: "Имя Фамилия" },
      { role: "Оператор-постановщик", name: "Имя Фамилия" },
      { role: "Художник-постановщик", name: "Имя Фамилия" },
    ],
  },
  {
    slug: "dok-gorod",
    title: "Город, который слышно",
    category: "Документальное",
    year: 2024,
    role: "Съёмка, монтаж, звук",
    duration: "22 мин",
    poster: "/posters/project-4.svg",
    summary: "Документальный портрет города через людей, которые работают по ночам.",
    description: [
      "Четыре героя, четыре ночные смены, ни одного постановочного кадра.",
      "Звук писали отдельной дорожкой — город в фильме слышно раньше, чем видно.",
    ],
    credits: [
      { role: "Режиссёр", name: "Имя Фамилия" },
      { role: "Оператор", name: "Имя Фамилия" },
      { role: "Саунд-дизайн", name: "Имя Фамилия" },
    ],
  },
  {
    slug: "brend-film",
    title: "Бренд-фильм",
    category: "Реклама",
    year: 2023,
    client: "Клиент",
    role: "Сняли сами",
    duration: "4 мин",
    poster: "/posters/project-5.svg",
    summary: "Фильм о производстве: люди, руки, материал — без закадрового пафоса.",
    description: [
      "Снимали на действующем производстве, не останавливая процесс.",
      "Использовали только естественный и рабочий свет цеха.",
    ],
    credits: [
      { role: "Продюсер", name: "Имя Фамилия" },
      { role: "Оператор", name: "Имя Фамилия" },
      { role: "Монтаж", name: "Имя Фамилия" },
    ],
  },
  {
    slug: "eksperiment",
    title: "Эксперимент",
    category: "Короткий метр",
    year: 2023,
    role: "Собственный проект",
    duration: "9 мин",
    poster: "/posters/project-6.svg",
    summary: "Внутренний проект объединения, снятый на плёнку 16 мм.",
    description: [
      "Делали для себя, чтобы проверить, как работает плёнка в смешанном свете.",
      "Отобран на два фестиваля короткого метра.",
    ],
    credits: [
      { role: "Режиссёр", name: "Имя Фамилия" },
      { role: "Оператор", name: "Имя Фамилия" },
    ],
  },
];

export const team: TeamMember[] = [
  {
    name: "Имя Фамилия",
    role: "Режиссёр",
    bio: "Придумывает, что снимаем, и спорит с остальными до последнего.",
  },
  {
    name: "Имя Фамилия",
    role: "Организует съёмки",
    bio: "Договаривается о локациях и следит, чтобы смена не затянулась до ночи.",
  },
  {
    name: "Имя Фамилия",
    role: "Оператор",
    bio: "Камера и свет. Любит естественный свет и длинные планы.",
  },
  {
    name: "Имя Фамилия",
    role: "Монтаж и цвет",
    bio: "Собирает отснятое и доводит картинку до ума.",
  },
];

/** Бегущая строка с теми, для кого снимали. Пока пусто — блок скрыт. */
export const clients: string[] = [];

export const navLinks = [
  { href: "/#works", label: "Работы" },
  { href: "/#services", label: "Умеем" },
  { href: "/#about", label: "Как снимаем" },
  { href: "/#team", label: "Кто мы" },
  { href: "/#contact", label: "Связь" },
];
