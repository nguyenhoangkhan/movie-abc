"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Grid, List, RefreshCw, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import { Button } from "@/components/ui/button";
import { useMovies, useInvalidateMovies } from "@/hooks/useMovies";

function MoviesContent() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const isAdultFilter = searchParams.get("adult") === "true";
  const invalidateMovies = useInvalidateMovies();

  // Use React Query instead of useState/useEffect
  const {
    data: movieData,
    isLoading,
    isError,
    error,
    isFetching,
    isPlaceholderData,
  } = useMovies(currentPage, selectedGenre, searchTerm, isAdultFilter);

  const movies = movieData?.movies || [];
  const totalPages = movieData?.totalPages || 1;

  const genres = [
    "Action",
    "Comedy",
    "Drama",
    "Horror",
    "Romance",
    "Sci-Fi",
    "Thriller",
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    invalidateMovies();
  };

  if (isError) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Có lỗi xảy ra
            </h2>
            <p className="text-muted-foreground mb-6">
              {error?.message || "Không thể tải danh sách phim"}
            </p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {isAdultFilter ? "Adult Movies" : "Movies"}
              {isFetching && (
                <Loader2 className="inline h-6 w-6 ml-3 animate-spin text-muted-foreground" />
              )}
            </h1>
            <p className="text-muted-foreground">
              {isAdultFilter
                ? "Exclusive adult content for registered users"
                : "Discover your next favorite movie"}
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isFetching}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Search */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedGenre}
                onChange={(e) => handleGenreChange(e.target.value)}
                className="input"
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>

              <div className="flex border border-border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="size-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading movies...</p>
            </div>
          </div>
        )}

        {/* Movies Grid */}
        {!isLoading && movies.length > 0 && (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  : "space-y-4"
              }
              style={{ opacity: isPlaceholderData ? 0.5 : 1 }}
            >
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-12 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || isFetching}
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        disabled={isFetching}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages || isFetching}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && movies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold mb-2">No movies found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedGenre
                ? "Try adjusting your search criteria"
                : "No movies are available at the moment"}
            </p>
            {(searchTerm || selectedGenre) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGenre("");
                  setCurrentPage(1);
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MoviesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen gradient-bg">
          <Navbar />
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading movies...</p>
            </div>
          </div>
        </div>
      }
    >
      <MoviesContent />
    </Suspense>
  );
}
