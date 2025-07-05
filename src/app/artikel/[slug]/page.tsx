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
  User,
  Tag,
  ChevronRight,
  Facebook,
  Twitter,
  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [copied, setCopied] = useState(false);

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

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = article?.title || "";
    const text = article?.excerpt || "";

    if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`,
        "_blank",
        "width=600,height=400"
      );
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`,
        "_blank",
        "width=600,height=400"
      );
    } else if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    } else {
      // Native share if available
      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
        } catch (err) {
          console.error("Share failed:", err);
        }
      } else {
        // Fallback to copy
        handleShare("copy");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Skeleton */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-4 mb-8">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-80 w-full rounded-lg mb-8" />
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
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-50 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Artikel Tidak Ditemukan
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Maaf, artikel yang Anda cari tidak ditemukan atau mungkin telah
            dihapus. Silakan coba artikel lainnya.
          </p>
          <Button asChild size="lg" className="shadow-lg">
            <Link href="/artikel">
              <ArrowLeft className="mr-2 h-5 w-5" />
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
      {/* Navigation Breadcrumb */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">
              Beranda
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href="/artikel"
              className="hover:text-primary transition-colors"
            >
              Artikel
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium truncate">
              {article.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Article Meta */}
            <div className="">
              <div className="flex items-center gap-4 mb-6">
                <Badge
                  variant={
                    article.status === "published" ? "default" : "secondary"
                  }
                  className="px-3 py-1"
                >
                  {article.status === "published"
                    ? "Dipublikasi"
                    : article.status === "draft"
                    ? "Draft"
                    : "Diarsipkan"}
                </Badge>
                <div className="flex items-center gap-6 text-sm text-gray-600">
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

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {article.title}
              </h1>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-xl text-gray-700 leading-relaxed mb-8 font-medium">
                  {article.excerpt}
                </p>
              )}

              {/* Author & Share */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Admin</p>
                      <p className="text-sm text-gray-600">Penulis</p>
                    </div>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 mr-2">Bagikan:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("facebook")}
                    className="px-3"
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("twitter")}
                    className="px-3"
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("copy")}
                    className="px-3"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {finalImageUrl && (
        <section className="bg-white pb-6">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={finalImageUrl}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className=" gap-8">
              {/* Main Content */}
              <div className="">
                <Card className="shadow-lg">
                  <CardContent className="p-8 md:p-12">
                    <div
                      className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-strong:text-gray-900 prose-blockquote:border-l-primary prose-blockquote:bg-gray-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg"
                      dangerouslySetInnerHTML={{
                        __html: formatContent(article.content),
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* SEO Meta Info */}
            {(article.meta_title || article.meta_description) && (
              <Card className="mt-8 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-4">
                    Informasi SEO
                  </h3>
                  <div className="space-y-3">
                    {article.meta_title && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 block mb-1">
                          Meta Title:
                        </span>
                        <p className="text-sm text-gray-800 font-medium">
                          {article.meta_title}
                        </p>
                      </div>
                    )}
                    {article.meta_description && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600 block mb-1">
                          Meta Description:
                        </span>
                        <p className="text-sm text-gray-800">
                          {article.meta_description}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Artikel Terkait
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Temukan artikel menarik lainnya yang mungkin Anda suka
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedArticles.slice(0, 3).map((relatedArticle) => (
                  <ArticleCard
                    key={relatedArticle.id}
                    article={relatedArticle}
                  />
                ))}
              </div>
              <div className="text-center mt-12">
                <Button asChild size="lg" className="shadow-lg">
                  <Link href="/artikel">
                    Lihat Semua Artikel
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Back to Top Button */}
      <Button
        className="fixed bottom-6 right-6 rounded-full shadow-2xl z-50"
        size="icon"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowLeft className="h-4 w-4 rotate-90" />
      </Button>
    </div>
  );
}
