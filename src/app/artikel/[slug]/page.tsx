"use client";

import { useParams } from "next/navigation";
import { useArticleBySlug, useFeaturedArticles } from "@/lib/hooks";
import { getArticleImageUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ArticleCard from "@/components/car/article-card";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  BookOpen,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: articleData, isLoading, error } = useArticleBySlug(slug);
  const { data: relatedArticlesData } = useFeaturedArticles(3);

  const article = articleData?.data?.[0];
  const relatedArticles =
    relatedArticlesData?.data?.filter(
      (relatedArticle) => relatedArticle.id !== article?.id
    ) || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatContent = (content: string) => {
    // Simple HTML rendering - in production, use a proper HTML parser
    return content.replace(/\n/g, "<br />");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-24 mb-6" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-1/3 mb-8" />
            <Skeleton className="h-64 w-full mb-8 rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Artikel Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-6">
            Artikel yang Anda cari tidak ditemukan atau telah dihapus.
          </p>
          <Button asChild>
            <Link href="/artikel">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Artikel
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const imageUrl = article.featured_image_url || article.featured_image;
  const finalImageUrl = imageUrl ? getArticleImageUrl(imageUrl) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link href="/artikel">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Artikel
            </Link>
          </Button>
        </div>
      </div>

      {/* Article Header */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Badge
                variant={
                  article.status === "published" ? "default" : "secondary"
                }
                className="mb-4"
              >
                {article.status === "published"
                  ? "Dipublikasi"
                  : article.status === "draft"
                  ? "Draft"
                  : "Diarsipkan"}
              </Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(article.published_at || article.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>5 min baca</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>123 views</span>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <div className="flex items-center gap-4 mb-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: article.title,
                      text: article.excerpt || "",
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Bagikan
              </Button>
            </div>

            {/* Featured Image */}
            {finalImageUrl && (
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8">
                <Image
                  src={finalImageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-8">
                {/* Excerpt */}
                {article.excerpt && (
                  <div className="mb-8">
                    <p className="text-lg text-gray-700 leading-relaxed font-medium border-l-4 border-primary pl-6 italic">
                      {article.excerpt}
                    </p>
                  </div>
                )}

                <Separator className="mb-8" />

                {/* Content */}
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: formatContent(article.content),
                  }}
                />
              </CardContent>
            </Card>

            {/* SEO Meta */}
            {(article.meta_title || article.meta_description) && (
              <Card className="mt-8">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Informasi SEO
                  </h3>
                  {article.meta_title && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-600">
                        Meta Title:
                      </span>
                      <p className="text-sm text-gray-800">
                        {article.meta_title}
                      </p>
                    </div>
                  )}
                  {article.meta_description && (
                    <div>
                      <span className="text-sm font-medium text-gray-600">
                        Meta Description:
                      </span>
                      <p className="text-sm text-gray-800">
                        {article.meta_description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Artikel Lainnya
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.slice(0, 3).map((relatedArticle) => (
                  <ArticleCard
                    key={relatedArticle.id}
                    article={relatedArticle}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
