"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Star,
  Calendar,
  Play,
  Clock,
  Share2,
  Heart,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import VideoPlayer from "@/components/VideoPlayer";
import toast from "react-hot-toast";

interface Movie {
  id: string;
  title: string;
  description?: string | null;
  poster?: string | null;
  backdrop?: string | null;
  releaseDate?: Date | null;
  rating?: number | null;
  genre: string[];
  isAdult: boolean;
}

interface WatchData {
  videoUrl: string;
  resolution: string;
  movie: {
    id: string;
    title: string;
    description?: string | null;
    poster?: string | null;
    backdrop?: string | null;
  };
}

export default function MovieWatchPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [watchData, setWatchData] = useState<WatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [watchLoading, setWatchLoading] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState("720p");
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [watchTime, setWatchTime] = useState(0);

  const movieId = params.id as string;

  useEffect(() => {
    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  const fetchMovie = async () => {
    try {
      const response = await fetch(`/api/movies/${movieId}`);
      const data = await response.json();

      if (data.success) {
        setMovie(data.data);
      } else {
        toast.error("Movie not found");
        router.push("/movies");
      }
    } catch (error) {
      toast.error("Error loading movie");
      router.push("/movies");
    } finally {
      setLoading(false);
    }
  };

  const handleWatch = async () => {
    if (movie?.isAdult && !session) {
      toast.error("Please login to watch adult content");
      router.push("/login");
      return;
    }

    setWatchLoading(true);
    try {
      const response = await fetch(`/api/watch/${movieId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolution: selectedResolution }),
      });

      const data = await response.json();

      if (data.success) {
        setWatchData(data.data);
        toast.success("Starting movie...");
      } else {
        if (data.quotaExceeded) {
          setShowQuotaModal(true);
        } else {
          toast.error(data.error);
        }
      }
    } catch (error) {
      toast.error("Error starting movie");
    } finally {
      setWatchLoading(false);
    }
  };

  const handleTimeUpdate = (currentTime: number) => {
    setWatchTime(currentTime);
  };

  const handleVideoEnd = () => {
    toast.success("Thanks for watching!");
  };

  const getAvailableResolutions = () => {
    const allResolutions = ["360p", "480p", "720p", "FHD"];
    const userPlan = session?.user?.plan || "GUEST";

    if (userPlan === "PREMIUM") {
      return allResolutions;
    }

    return allResolutions.filter((res) => res !== "FHD");
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="aspect-video bg-muted rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Movie not found
            </h1>
            <button
              onClick={() => router.push("/movies")}
              className="btn btn-primary"
            >
              Back to Movies
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Video Player or Backdrop */}
        <div className="aspect-video rounded-lg overflow-hidden mb-8 bg-black">
          {watchData ? (
            <VideoPlayer
              src={watchData.videoUrl}
              title={movie.title}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnd}
            />
          ) : (
            <div
              className="w-full h-full bg-cover bg-center relative flex items-center justify-center"
              style={{
                backgroundImage: movie.backdrop
                  ? `url(${movie.backdrop})`
                  : `url(${movie.poster})`,
              }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
              <div className="relative z-10 text-center">
                <button
                  onClick={handleWatch}
                  disabled={watchLoading}
                  className="btn btn-primary btn-lg flex items-center space-x-2"
                >
                  <Play className="h-6 w-6" />
                  <span>{watchLoading ? "Loading..." : "Watch Now"}</span>
                </button>

                {/* Resolution Selector */}
                <div className="mt-4">
                  <select
                    value={selectedResolution}
                    onChange={(e) => setSelectedResolution(e.target.value)}
                    className="input bg-black/50 text-white border-white/20"
                  >
                    {getAvailableResolutions().map((res) => (
                      <option key={res} value={res}>
                        {res === "FHD" ? "1080p (Premium)" : res}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              {/* Title and Rating */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {movie.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    {movie.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{movie.rating.toFixed(1)}</span>
                      </div>
                    )}
                    {movie.releaseDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(movie.releaseDate).getFullYear()}</span>
                      </div>
                    )}
                    {movie.isAdult && (
                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                        18+
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button className="btn btn-ghost btn-sm">
                    <Heart className="h-4 w-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Genres */}
              {movie.genre.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre.map((genre) => (
                    <span
                      key={genre}
                      className="bg-muted px-3 py-1 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {movie.description && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-3">
                    Overview
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {movie.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Movie Poster */}
            {movie.poster && (
              <div className="card p-4">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* Watch Stats */}
            {session && (
              <div className="card p-4">
                <h3 className="font-semibold text-foreground mb-3">
                  Your Progress
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Watch Time</span>
                    <span className="text-foreground">
                      {Math.floor(watchTime / 60)}:
                      {(watchTime % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quality</span>
                    <span className="text-foreground">
                      {selectedResolution}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quota Info for Free Users */}
            {session?.user?.plan === "FREE" && (
              <div className="card p-4 border-yellow-500">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium text-foreground">Free Plan</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  You have limited daily views. Upgrade to Premium for unlimited
                  access.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quota Exceeded Modal */}
      {showQuotaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Daily Limit Reached
            </h3>
            <p className="text-muted-foreground mb-6">
              You've reached your daily viewing limit. Here are your options:
            </p>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => router.push("/account")}
                className="btn btn-primary w-full"
              >
                Upgrade to Premium
              </button>
              <button
                onClick={() => router.push("/account")}
                className="btn btn-outline w-full"
              >
                Invite Friends for Bonus Views
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowQuotaModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
