"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Settings,
  Loader2,
  Calendar,
  Clock,
  Star,
  Eye,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/VideoPlayer";
import MovieVideoPlayer from "@/components/MovieVideoPlayer";
import Navbar from "@/components/Navbar";

interface WatchData {
  videoUrl: string;
  resolution: string;
  movie: {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    poster?: string;
    genre: string;
    rating?: number;
    releaseYear?: number;
    duration?: string;
    status?: string;
    type?: string;
    quality?: string;
    view?: number;
    episodeCurrent?: string;
    episodeTotal?: string;
  };
  episodes?: Array<{
    name: string;
    slug: string;
    filename: string;
    link_embed: string;
    link_m3u8: string;
  }>;
  currentEpisode?: {
    name: string;
    slug: string;
  };
}

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [watchData, setWatchData] = useState<WatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResolution, setSelectedResolution] = useState("720p");
  const [selectedEpisode, setSelectedEpisode] = useState<string>("");

  const startWatching = async (
    resolution: string = "720p",
    episodeSlug?: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/watch/${params.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setWatchData(data.data);
        setSelectedResolution(resolution);
      } else {
        if (data.quotaExceeded) {
          setError(data.error || "Quota exceeded");
        } else {
          setError(data.error || "Failed to start watching");
        }
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      startWatching(selectedResolution);
    }
  }, [params.id]);

  const handleResolutionChange = (resolution: string) => {
    if (resolution !== selectedResolution) {
      startWatching(resolution, selectedEpisode);
    }
  };

  const handleEpisodeChange = (episodeSlug: string) => {
    setSelectedEpisode(episodeSlug);
    startWatching(selectedResolution, episodeSlug);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center text-white">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Đang tải phim...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-16">
        {/* Video Player */}
        <MovieVideoPlayer 
          movieSlug={params.id as string}
          movieTitle="Loading..."
          episodeSlug={selectedEpisode}
          className="w-full"
        />
      </div>
    </div>
  );
}
          <div className="container mx-auto px-4 py-6">
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Play className="h-4 w-4 mr-2" />
                Danh sách tập ({watchData.episodes.length} tập)
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
                {watchData.episodes.map((episode, index) => (
                  <button
                    key={episode.slug}
                    onClick={() => handleEpisodeChange(episode.slug)}
                    className={`p-2 rounded text-sm font-medium transition-colors ${
                      selectedEpisode === episode.slug ||
                      (!selectedEpisode && index === 0)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                    disabled={loading}
                  >
                    {episode.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Movie Info & Controls */}
        {watchData && (
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col xl:flex-row gap-6">
              {/* Left Column - Movie Info & Episodes */}
              <div className="flex-1">
                {/* Back Button */}
                <div className="flex items-start gap-4 mb-6">
                  <Button
                    onClick={() => router.back()}
                    variant="outline"
                    size="sm"
                    className="text-white border-white hover:bg-white hover:text-black"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                  </Button>
                </div>

                {/* Movie Header */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                  {/* Movie Poster */}
                  <div className="flex-shrink-0">
                    <div className="relative w-64 h-96 rounded-lg overflow-hidden shadow-2xl">
                      <Image
                        src={
                          watchData.movie.poster ||
                          watchData.movie.thumbnail ||
                          "/placeholder-movie.jpg"
                        }
                        alt={watchData.movie.title}
                        fill
                        className="object-cover"
                        sizes="256px"
                      />
                      {/* Quality Badge */}
                      {watchData.movie.quality && (
                        <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded font-semibold">
                          {watchData.movie.quality}
                        </div>
                      )}
                      {/* Age Rating Badge */}
                      <div className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                        16+
                      </div>
                    </div>
                  </div>

                  {/* Movie Details */}
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                      {watchData.movie.title}
                    </h1>

                    {/* Episode Info */}
                    {watchData.currentEpisode && (
                      <div className="mb-4">
                        <span className="text-blue-400 font-semibold">
                          Đang xem: {watchData.currentEpisode.name}
                        </span>
                      </div>
                    )}

                    {/* Movie Meta */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                      {watchData.movie.releaseYear && (
                        <div className="flex items-center text-gray-300">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{watchData.movie.releaseYear}</span>
                        </div>
                      )}
                      {watchData.movie.duration && (
                        <div className="flex items-center text-gray-300">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{watchData.movie.duration}</span>
                        </div>
                      )}
                      {watchData.movie.rating && (
                        <div className="flex items-center text-gray-300">
                          <Star className="h-4 w-4 mr-2" />
                          <span>{watchData.movie.rating}</span>
                        </div>
                      )}
                      {watchData.movie.view && (
                        <div className="flex items-center text-gray-300">
                          <Eye className="h-4 w-4 mr-2" />
                          <span>{watchData.movie.view.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Additional Info */}
                    <div className="space-y-2 text-sm text-gray-400 mb-6">
                      <div>
                        <span className="text-white">Thể loại: </span>
                        {watchData.movie.genre}
                      </div>
                      {watchData.movie.status && (
                        <div>
                          <span className="text-white">Trạng thái: </span>
                          {watchData.movie.status}
                        </div>
                      )}
                      {watchData.movie.type && (
                        <div>
                          <span className="text-white">Loại: </span>
                          {watchData.movie.type}
                        </div>
                      )}
                      {watchData.movie.episodeCurrent && (
                        <div>
                          <span className="text-white">Tập hiện tại: </span>
                          {watchData.movie.episodeCurrent}
                          {watchData.movie.episodeTotal &&
                            ` / ${watchData.movie.episodeTotal}`}
                        </div>
                      )}
                    </div>

                    {watchData.movie.description && (
                      <div>
                        <h3 className="text-white font-semibold mb-2">
                          Nội dung
                        </h3>
                        <p className="text-gray-300 leading-relaxed">
                          {watchData.movie.description.replace(/<[^>]*>/g, "")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Controls */}
              <div className="xl:w-80">
                <div className="bg-gray-900 rounded-lg p-4 sticky top-20">
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Cài đặt video
                  </h3>

                  {/* Resolution Controls */}
                  <div className="mb-6">
                    <h4 className="text-gray-300 text-sm mb-2">Chất lượng</h4>
                    <div className="space-y-2">
                      {["1080p", "720p", "480p", "360p"].map((resolution) => (
                        <button
                          key={resolution}
                          onClick={() => handleResolutionChange(resolution)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                            resolution === selectedResolution
                              ? "bg-blue-600 text-white"
                              : "text-gray-300 hover:bg-gray-800"
                          }`}
                          disabled={loading}
                        >
                          {resolution}
                          {resolution === selectedResolution && (
                            <span className="float-right">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Current Episode Info */}
                  {watchData.currentEpisode && (
                    <div className="mb-4 p-3 bg-gray-800 rounded">
                      <div className="text-xs text-gray-400 mb-1">
                        Đang phát
                      </div>
                      <div className="text-white font-medium">
                        {watchData.currentEpisode.name}
                      </div>
                    </div>
                  )}

                  {/* User Plan Info */}
                  {session && (
                    <div className="pt-4 border-t border-gray-700">
                      <p className="text-xs text-gray-400 mb-2">
                        Gói hiện tại: {session.user.plan || "GUEST"}
                      </p>
                      {session.user.plan !== "PREMIUM" && (
                        <Link href="/account">
                          <Button size="sm" className="w-full">
                            Nâng cấp Premium
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
