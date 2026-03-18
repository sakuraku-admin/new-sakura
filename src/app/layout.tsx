import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "さく楽 | プライベート整体サロン",
  description: "巡り、あたため、身体を深く整える。プライベート整体サロン さく楽",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
