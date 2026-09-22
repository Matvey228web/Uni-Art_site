import FilmGrain from "@/components/FilmGrain";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/** Каркас основного сайта: шапка и подвал. Прототипы в /lab его не используют. */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <FilmGrain />
    </>
  );
}
