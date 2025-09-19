import Image from "next/image";
import { Play, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Episode {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

interface RecommendedMovie {
  id: string;
  title: string;
  thumbnail?: string;
  poster?: string;
  year?: number;
  rating?: number;
  duration?: string;
  slug?: string;
}

interface EpisodeListProps {
  episodes?: Episode[];
  recommendedMovies?: RecommendedMovie[];
  currentEpisode?: string;
  movieTitle: string;
  onEpisodeSelect: (episodeSlug: string) => void;
  onMovieSelect?: (movieSlug: string) => void;
}

export default function EpisodeList({
  episodes,
  recommendedMovies,
  currentEpisode,
  movieTitle,
  onEpisodeSelect,
  onMovieSelect,
}: EpisodeListProps) {
  const hasEpisodes = episodes && episodes.length > 1;

  if (!hasEpisodes && (!recommendedMovies || recommendedMovies.length === 0)) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {hasEpisodes ? (
        // Episodes Section
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Play className="h-6 w-6 mr-2" />
            Danh sách tập ({episodes.length} tập)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {episodes.map((episode, index) => (
              <button
                key={episode.slug}
                onClick={() => onEpisodeSelect(episode.slug)}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  currentEpisode === episode.slug ||
                  (!currentEpisode && index === 0)
                    ? "bg-blue-600 text-white border-blue-500 shadow-lg transform scale-105"
                    : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:border-gray-600"
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <Play className="h-4 w-4" />
                  <span>{episode.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Recommended Movies Section
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Star className="h-6 w-6 mr-2" />
            Phim đề xuất
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {recommendedMovies?.map((movie) => (
              <div
                key={movie.id}
                className="group cursor-pointer"
                onClick={() => onMovieSelect?.(movie.slug || movie.id)}
              >
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800 mb-3 group-hover:transform group-hover:scale-105 transition-transform duration-200">
                  <Image
                    src={
                      movie.poster ||
                      movie.thumbnail ||
                      "/placeholder-movie.jpg"
                    }
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Play className="h-3 w-3 mr-1" />
                      Xem
                    </Button>
                  </div>

                  {/* Rating Badge */}
                  {movie.rating && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">
                      {movie.rating}
                    </div>
                  )}

                  {/* Duration Badge */}
                  {movie.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {movie.duration}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {movie.title}
                  </h3>
                  {movie.year && (
                    <p className="text-gray-400 text-xs">{movie.year}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Episodes Info for Series */}
      {hasEpisodes && (
        <div className="mt-8 p-4 bg-gray-900 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Thông tin series</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Tên phim: </span>
              <span className="text-white">{movieTitle}</span>
            </div>
            <div>
              <span className="text-gray-400">Tổng số tập: </span>
              <span className="text-white">{episodes.length} tập</span>
            </div>
            <div>
              <span className="text-gray-400">Trạng thái: </span>
              <span className="text-green-400">Hoàn thành</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
