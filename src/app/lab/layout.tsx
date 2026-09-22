import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Прототипы",
  robots: { index: false, follow: false },
};

/** Прототипы живут без шапки и подвала основного сайта. */
export default function LabLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <main id="main">{children}</main>;
}
