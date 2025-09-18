import Image from "next/image";
import Link from "next/link";
import { Star, Calendar, Play, Clock, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  description?: string | null;
  thumbnail?: string | null;
  poster?: string | null;
  year?: number;
  rating?: number | null;
  genre: string[];
  duration?: string;
  quality?: string;
  type?: string;
  status?: string;
  episodeCurrent?: string;
  episodeTotal?: string;
  view?: number;
  slug?: string;
  isAdult: boolean;
  createdAt?: string;
}

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const movieUrl = movie.slug ? `/movies/${movie.slug}` : `/movies/${movie.id}`;
  const posterImage =
    movie.thumbnail || movie.poster || "/placeholder-movie.jpg";

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105">
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={posterImage}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button asChild>
            <Link href={movieUrl} className="flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>Xem Ngay</span>
            </Link>
          </Button>
        </div>

        {/* Quality Badge */}
        {movie.quality && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded font-semibold">
            {movie.quality}
          </div>
        )}

        {/* Adult Badge */}
        {movie.isAdult && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            18+
          </div>
        )}

        {/* Rating */}
        {movie.rating && movie.rating > 0 && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        )}

        {/* View Count */}
        {movie.view && movie.view > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{movie.view.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {movie.title}
          </h3>
          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {movie.originalTitle}
            </p>
          )}
        </div>

        {movie.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {movie.description.replace(/<[^>]*>/g, "")} {/* Remove HTML tags */}
          </p>
        )}

        {/* Episode Info */}
        {movie.episodeCurrent && (
          <div className="mb-2 text-xs text-blue-600 font-semibold">
            {movie.episodeCurrent}
            {movie.episodeTotal &&
              movie.episodeTotal !== movie.episodeCurrent &&
              ` / ${movie.episodeTotal}`}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            {movie.year && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{movie.year}</span>
              </div>
            )}

            {movie.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{movie.duration}</span>
              </div>
            )}
          </div>

          {movie.genre && movie.genre.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {movie.genre.slice(0, 2).map((g, index) => (
                <span
                  key={index}
                  className="bg-muted px-2 py-1 rounded text-xs"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
