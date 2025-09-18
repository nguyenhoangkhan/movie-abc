"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Star,
  Calendar,
  Clock,
  Users,
  Film,
  ArrowLeft,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface MovieDetail {
  id: string;
  title: string;
  originalTitle?: string;
  description?: string;
  thumbnail?: string;
  poster?: string;
  year?: number;
  rating?: number;
  genre: string[];
  duration?: string;
  quality?: string;
  type?: string;
  status?: string;
  episodeCurrent?: string;
  episodeTotal?: string;
  view?: number;
  country: string[];
  director: string[];
  actors: string[];
  trailerUrl?: string;
  slug?: string;
  episodes?: Array<{
    server_name: string;
    server_data: Array<{
      name: string;
      slug: string;
      filename: string;
      link_embed: string;
      link_m3u8: string;
    }>;
  }>;
}

export default function MovieDetailPage() {
  const params = useParams();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`/api/movies/${params.slug}`);
        const data = await response.json();

        if (data.success) {
          setMovie(data.data.movie);
        } else {
          setError(data.error || "Failed to load movie");
        }
      } catch (err) {
        setError("Network error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchMovie();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải thông tin phim...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-500 mb-4">
              {error || "Không tìm thấy phim"}
            </p>
            <Button asChild>
              <Link href="/movies">Quay lại danh sách phim</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <Image
          src={movie.thumbnail || movie.poster || "/placeholder-movie.jpg"}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 container mx-auto px-4 h-full flex items-end pb-16">
          <div className="max-w-4xl">
            <Button
              asChild
              variant="ghost"
              className="mb-4 text-white hover:bg-white/20"
            >
              <Link href="/movies">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Link>
            </Button>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {movie.title}
            </h1>

            {movie.originalTitle && movie.originalTitle !== movie.title && (
              <p className="text-xl text-gray-300 mb-4">
                {movie.originalTitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-white mb-6">
              {movie.year && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{movie.year}</span>
                </div>
              )}

              {movie.duration && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{movie.duration}</span>
                </div>
              )}

              {movie.rating && movie.rating > 0 && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                  <span>{movie.rating.toFixed(1)}</span>
                </div>
              )}

              {movie.view && (
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{movie.view.toLocaleString()} lượt xem</span>
                </div>
              )}

              {movie.quality && (
                <span className="bg-green-600 px-3 py-1 rounded font-semibold">
                  {movie.quality}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg">
                <Play className="size-5 mr-2" />
                Xem Ngay
              </Button>

              {movie.trailerUrl && (
                <Button variant="outline" size="lg" asChild>
                  <a
                    href={movie.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Film className="size-5 mr-2" />
                    Trailer
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            {movie.description && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Nội dung phim</h2>
                <div
                  className="text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: movie.description.replace(/<[^>]*>/g, ""),
                  }}
                />
              </div>
            )}

            {/* Episodes */}
            {movie.episodes && movie.episodes.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Danh sách tập phim</h2>
                {movie.episodes.map((server, serverIndex) => (
                  <div key={serverIndex} className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">
                      {server.server_name}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {server.server_data.map((episode, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="h-12 text-sm"
                          asChild
                        >
                          <a
                            href={episode.link_embed}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {episode.name}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Movie Info */}
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Thông tin phim</h3>
              <div className="space-y-3">
                {movie.type && (
                  <div>
                    <span className="font-semibold">Loại phim: </span>
                    <span className="text-muted-foreground">{movie.type}</span>
                  </div>
                )}

                {movie.status && (
                  <div>
                    <span className="font-semibold">Trạng thái: </span>
                    <span className="text-muted-foreground">
                      {movie.status}
                    </span>
                  </div>
                )}

                {movie.episodeCurrent && (
                  <div>
                    <span className="font-semibold">Tập phim: </span>
                    <span className="text-muted-foreground">
                      {movie.episodeCurrent}
                      {movie.episodeTotal && ` / ${movie.episodeTotal}`}
                    </span>
                  </div>
                )}

                {movie.country.length > 0 && (
                  <div>
                    <span className="font-semibold">Quốc gia: </span>
                    <span className="text-muted-foreground">
                      {movie.country.join(", ")}
                    </span>
                  </div>
                )}

                {movie.director.length > 0 && (
                  <div>
                    <span className="font-semibold">Đạo diễn: </span>
                    <span className="text-muted-foreground">
                      {movie.director.join(", ")}
                    </span>
                  </div>
                )}

                {movie.actors.length > 0 && (
                  <div>
                    <span className="font-semibold">Diễn viên: </span>
                    <span className="text-muted-foreground">
                      {movie.actors.slice(0, 5).join(", ")}
                      {movie.actors.length > 5 && "..."}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Genres */}
            {movie.genre.length > 0 && (
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Thể loại</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genre.map((g, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
