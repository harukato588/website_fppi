import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "UKM FPPI — Forum Penalaran Penelitian Ilmiah",
  description:
    "Wadah pengembangan penalaran, penelitian, dan karya ilmiah mahasiswa menuju prestasi yang gemilang.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
