"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/VideoPlayer";
import Navbar from "@/components/Navbar";

interface WatchData {
  videoUrl: string;
  resolution: string;
  movie: {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    genre: string;
    rating?: number;
    releaseYear?: number;
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

  const startWatching = async (resolution: string = "720p") => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/watch/${params.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resolution }),
      });

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
      startWatching(resolution);
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Không thể xem phim
            </h2>
            <p className="text-gray-300 mb-6 max-w-md">{error}</p>
            <div className="space-x-4">
              <Button
                onClick={() => router.back()}
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-black"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              {error.includes("Premium") && (
                <Button asChild>
                  <Link href="/account">Nâng cấp Premium</Link>
                </Button>
              )}
              {error.includes("login") && (
                <Button asChild>
                  <Link href="/login">Đăng nhập</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!watchData) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center text-white">
            <p>Không tìm thấy dữ liệu phim</p>
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
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
        <div className="relative">
          <VideoPlayer
            src={watchData.videoUrl}
            title={watchData.movie.title}
            onTimeUpdate={(time) => {
              // Could save watch progress here
            }}
            onEnded={() => {
              // Could handle video end here
            }}
          />
        </div>

        {/* Movie Info & Controls */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Movie Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
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

              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                {watchData.movie.title}
              </h1>

              {watchData.movie.description && (
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {watchData.movie.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {watchData.movie.releaseYear && (
                  <span>Năm: {watchData.movie.releaseYear}</span>
                )}
                {watchData.movie.rating && (
                  <span>Đánh giá: ⭐ {watchData.movie.rating}</span>
                )}
                <span>Thể loại: {watchData.movie.genre}</span>
                <span>Chất lượng: {selectedResolution}</span>
              </div>
            </div>

            {/* Resolution Controls */}
            <div className="lg:w-64">
              <div className="bg-gray-900 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Chất lượng video
                </h3>
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

                {/* User Plan Info */}
                {session && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400">
                      Gói hiện tại: {session.user.plan || "GUEST"}
                    </p>
                    {session.user.plan !== "PREMIUM" && (
                      <Link href="/account">
                        <Button size="sm" className="w-full mt-2">
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
      </div>
    </div>
  );
}
