import Link from "next/link";
import { Play, Star, TrendingUp, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/52AfXWuXCHn3UjD17rBruA9f5qb.jpg)",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Stream Movies
            <span className="block text-primary">Anywhere</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 animate-slide-up">
            Watch thousands of movies and TV shows with our premium streaming
            service
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button asChild size="lg">
              <Link
                href="/movies"
                className="flex items-center justify-center space-x-2"
              >
                <Play className="size-5" />
                <span>Start Watching</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Why Choose movieABC?
          </h2>
          <p className="text-xl text-muted-foreground">
            Experience the best movie streaming platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center p-8">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Instant Streaming</h3>
            <p className="text-muted-foreground">
              Watch your favorite movies instantly without any delays or
              buffering
            </p>
          </div>

          <div className="card text-center p-8">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">High Quality</h3>
            <p className="text-muted-foreground">
              Enjoy movies in up to 4K resolution with crystal clear audio
            </p>
          </div>

          <div className="card text-center p-8">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Daily Free Views</h3>
            <p className="text-muted-foreground">
              Get 5 free movie views daily, or upgrade for unlimited access
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Simple Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that&apos;s right for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Guest Plan */}
            <div className="card p-8 relative flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Guest</h3>
                <div className="text-4xl font-bold mb-4">Free</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Limited movie access
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Up to 720p quality
                  </li>
                  <li className="flex items-center">
                    <span className="text-red-500 mr-2">✗</span>
                    No adult content
                  </li>
                </ul>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/movies">Browse Movies</Link>
              </Button>
            </div>

            {/* Free Plan */}
            <div className="card p-8 relative flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Free User</h3>
                <div className="text-4xl font-bold mb-4">Free</div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>5 daily views
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Up to 720p quality
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Access to adult content
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Invite friends for bonus views
                  </li>
                </ul>
              </div>
              <Button
                asChild
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Link href="/register">Sign Up Free</Link>
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="card p-8 relative flex flex-col justify-between border-primary">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <div>
                {" "}
                <h3 className="text-2xl font-semibold mb-4">Premium</h3>
                <div className="text-4xl font-bold mb-4">
                  $9.99
                  <span className="text-lg font-normal text-muted-foreground">
                    /month
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Unlimited views
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Up to 4K quality
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    All content access
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    No ads
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Early access to new releases
                  </li>
                </ul>
              </div>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/account">Upgrade Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
