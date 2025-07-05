import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artikel & Tips Otomotif",
  description:
    "Temukan tips, panduan, dan informasi terbaru seputar dunia otomotif untuk membantu Anda membuat keputusan yang tepat",
  keywords: [
    "artikel otomotif",
    "tips mobil",
    "panduan otomotif",
    "berita otomotif",
  ],
};

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
