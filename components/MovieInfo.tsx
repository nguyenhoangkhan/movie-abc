import Image from "next/image";
import { Star, Calendar, Clock, Eye, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieInfoProps {
  movie: {
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
    slug?: string;
  };
  onPlayClick: () => void;
}

export default function MovieInfo({ movie, onPlayClick }: MovieInfoProps) {
  return (
    <div className="relative w-full">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60 z-10" />

      {/* Background poster (blurred) */}
      <div className="absolute inset-0">
        <Image
          src={movie.poster || movie.thumbnail || "/placeholder-movie.jpg"}
          alt={movie.title}
          fill
          className="object-cover opacity-30 blur-sm"
          sizes="100vw"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Movie Poster */}
          <div className="flex-shrink-0 mx-auto lg:mx-0">
            <div className="relative w-64 h-96 lg:w-80 lg:h-[480px] rounded-lg overflow-hidden shadow-2xl">
              {/* IMDb Rating Badge */}
              {movie.rating && (
                <div className="absolute -top-3 -left-3 w-16 h-16 bg-yellow-500 rounded-full flex flex-col items-center justify-center text-black font-bold text-lg shadow-lg z-10">
                  <span className="text-sm">{movie.rating.toFixed(1)}</span>
                  <span className="text-xs font-medium -mt-1">IMDb</span>
                </div>
              )}

              <Image
                src={
                  movie.poster || movie.thumbnail || "/placeholder-movie.jpg"
                }
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 256px, 320px"
                priority
              />

              {/* Quality Badge */}
              {movie.quality && (
                <div className="absolute bottom-3 left-3 bg-green-600 text-white text-xs px-2 py-1 rounded font-semibold">
                  {movie.quality}
                </div>
              )}

              {/* Age Rating Badge */}
              <div className="absolute bottom-3 right-3 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                16+
              </div>
            </div>
          </div>

          {/* Movie Details */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            {/* Title */}
            <div>
              <h1 className="text-3xl lg:text-5xl font-bold text-white mb-2">
                {movie.title}
              </h1>
              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <p className="text-lg text-gray-300">{movie.originalTitle}</p>
              )}
            </div>

            {/* Movie Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* Left Column */}
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Genre: </span>
                  <span className="text-white">{movie.genre.join(", ")}</span>
                </div>
                {movie.year && (
                  <div>
                    <span className="text-gray-400">Year: </span>
                    <span className="text-white">{movie.year}</span>
                  </div>
                )}
                {movie.type && (
                  <div>
                    <span className="text-gray-400">Type: </span>
                    <span className="text-white">{movie.type}</span>
                  </div>
                )}
                {movie.country.length > 0 && (
                  <div>
                    <span className="text-gray-400">Country: </span>
                    <span className="text-white">
                      {movie.country.join(", ")}
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {movie.duration && (
                  <div>
                    <span className="text-gray-400">Duration: </span>
                    <span className="text-white">{movie.duration}</span>
                  </div>
                )}
                {movie.status && (
                  <div>
                    <span className="text-gray-400">Status: </span>
                    <span className="text-white">{movie.status}</span>
                  </div>
                )}
                {movie.episodeCurrent && (
                  <div>
                    <span className="text-gray-400">Episodes: </span>
                    <span className="text-white">
                      {movie.episodeCurrent}
                      {movie.episodeTotal && ` / ${movie.episodeTotal}`}
                    </span>
                  </div>
                )}
                {movie.view ? (
                  <div>
                    <span className="text-gray-400">Views: </span>
                    <span className="text-white">
                      {movie.view.toLocaleString()}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Director & Cast */}
            <div className="space-y-3 text-sm">
              {movie.director.length > 0 && (
                <div>
                  <span className="text-gray-400">Director: </span>
                  <span className="text-white">
                    {movie.director.join(", ")}
                  </span>
                </div>
              )}
              {movie.actors.length > 0 && (
                <div>
                  <span className="text-gray-400">Cast: </span>
                  <span className="text-white">
                    {movie.actors.slice(0, 5).join(", ")}
                  </span>
                  {movie.actors.length > 5 && (
                    <span className="text-gray-400">
                      {" "}
                      and {movie.actors.length - 5} more...
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            {movie.description && (
              <div className="space-y-2">
                <p className="text-gray-300 leading-relaxed text-sm lg:text-base max-w-4xl">
                  {movie.description.replace(/<[^>]*>/g, "")}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={onPlayClick}
                size="lg"
                className=" text-white px-8 py-3 text-lg font-semibold"
              >
                <Play className="h-5 w-5 mr-2" />
                Watch now
              </Button>

              {/* <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-black px-8 py-3"
              >
                <Star className="h-5 w-5 mr-2" />
                Yêu thích
              </Button> */}
            </div>

            {/* Additional Stats */}
            <div className="flex flex-wrap gap-6 text-xs text-gray-400 pt-4">
              {movie.year ? (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.year}</span>
                </div>
              ) : null}
              {movie.duration ? (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{movie.duration}</span>
                </div>
              ) : null}
              {movie.rating ? (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{movie.rating.toFixed(1)}/10</span>
                </div>
              ) : null}
              {movie.view ? (
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{movie.view.toLocaleString()} views</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
