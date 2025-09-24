"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import MovieVideoPlayer from "@/components/MovieVideoPlayer";
import Navbar from "@/components/Navbar";

export default function WatchPage() {
  const params = useParams();
  const [selectedEpisode, setSelectedEpisode] = useState<string>("");

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
