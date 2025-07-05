import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Clock, ArrowRight } from "lucide-react";
import { getArticleImageUrl } from "@/lib/api";
import ArticlePlaceholder from "./article-placeholder";
import type { Article } from "@/lib/types";
import { useState } from "react";

interface ArticleCardProps {
  article: Article;
  className?: string;
  showExcerpt?: boolean;
}

export default function ArticleCard({
  article,
  className,
  showExcerpt = true,
}: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = article.featured_image_url || article.featured_image;
  const finalImageUrl =
    imageUrl && !imageError ? getArticleImageUrl(imageUrl) : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card
      className={`group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-white hover:scale-[1.02] ${className}`}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-[16/9] relative">
          {finalImageUrl ? (
            <Image
              src={finalImageUrl}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <ArticlePlaceholder />
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={article.status === "published" ? "default" : "secondary"}
          >
            {article.status === "published"
              ? "Dipublikasi"
              : article.status === "draft"
              ? "Draft"
              : "Diarsipkan"}
          </Badge>
        </div>

        {/* View Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            asChild
            size="sm"
            className="bg-white text-black hover:bg-gray-100"
          >
            <Link href={`/artikel/${article.slug}`}>
              <Eye className="mr-2 h-4 w-4" />
              Baca Artikel
            </Link>
          </Button>
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(article.published_at || article.created_at)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>5 min baca</span>
          </div>
        </div>

        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          <Link href={`/artikel/${article.slug}`}>{article.title}</Link>
        </h3>
      </CardHeader>

      {showExcerpt && (
        <CardContent className="p-4 pt-0">
          {article.excerpt && (
            <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
              {article.excerpt}
            </p>
          )}

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 p-0 font-medium group-hover:text-primary"
          >
            <Link href={`/artikel/${article.slug}`}>
              Baca Selengkapnya
              <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
