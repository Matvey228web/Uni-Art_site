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
      <main id="main" className="flutter-page">{children}</main>
      <Footer />
      <FilmGrain />
      <RimLight />
    </>
  );
}
