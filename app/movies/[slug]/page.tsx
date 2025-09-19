"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MovieInfo from "@/components/MovieInfo";
import MovieVideoPlayer from "@/components/MovieVideoPlayer";
import EpisodeList from "@/components/EpisodeList";

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
  videoSources?: { quality: string; url: string }[];
  episodes?: Array<{
    name: string;
    slug: string;
    filename: string;
    link_embed: string;
    link_m3u8: string;
  }>;
  recommendedMovies?: Array<{
    id: string;
    title: string;
    thumbnail?: string;
    poster?: string;
    year?: number;
    rating?: number;
    duration?: string;
    slug?: string;
  }>;
}

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<string>("");

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/movies/${params.slug}`);
        const data = await response.json();

        if (data.success) {
          setMovie(data.data);
        } else {
          setError(data.error || "Failed to fetch movie");
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

  const handlePlayClick = () => {
    setShowVideoPlayer(true);
  };

  const handleEpisodeSelect = (episodeSlug: string) => {
    setSelectedEpisode(episodeSlug);
    setShowVideoPlayer(true);
  };

  const handleMovieSelect = (movieSlug: string) => {
    router.push(`/movies/${movieSlug}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Đang tải thông tin phim...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Không tìm thấy phim
            </h2>
            <p className="text-gray-300 mb-6 max-w-md">
              {error || "Phim bạn tìm kiếm không tồn tại hoặc đã bị gỡ"}
            </p>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      {/* Movie Information Section */}
      <MovieInfo 
        movie={movie} 
        onPlayClick={handlePlayClick}
      />

      {/* Video Player Section */}
      {showVideoPlayer && (
        <div className="container mx-auto px-4 py-8">
          <MovieVideoPlayer
            movieId={movie.id}
            movieTitle={movie.title}
            episodeSlug={selectedEpisode}
            videoSources={movie.videoSources}
            className="rounded-lg overflow-hidden shadow-2xl"
          />
        </div>
      )}

      {/* Episodes/Recommended Movies Section */}
      <EpisodeList
        episodes={movie.episodes}
        recommendedMovies={movie.recommendedMovies}
        currentEpisode={selectedEpisode}
        movieTitle={movie.title}
        onEpisodeSelect={handleEpisodeSelect}
        onMovieSelect={handleMovieSelect}
      />

      <Footer />
    </div>
  );
}