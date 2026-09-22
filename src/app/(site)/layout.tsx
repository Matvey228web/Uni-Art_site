import FilmGrain from "@/components/FilmGrain";
import RimLight from "@/components/RimLight";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/** Каркас основного сайта: шапка и подвал. Прототипы в /lab его не используют. */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      {/* ореол контрового света выходит за края элементов и расширял бы
          область прокрутки: обрезаем по горизонтали, по вертикали он нужен */}
      <main id="main" className="flutter-page overflow-x-clip">
        {children}
      </main>
      <Footer />
      <FilmGrain />
      <RimLight />
    </>
  );
}
