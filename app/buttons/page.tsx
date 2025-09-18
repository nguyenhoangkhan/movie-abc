"use client";

import { Button } from "@/components/ui/button";
import {
  Download,
  Mail,
  Plus,
  Settings,
  Trash2,
  Heart,
  Share,
  Play,
  Pause,
  Star,
  BookmarkPlus,
  ArrowRight,
} from "lucide-react";

export default function ButtonShowcase() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Button Components Showcase
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover all button variants and sizes inspired by Shadcn UI
          </p>
        </div>

        {/* Basic Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Basic Variants
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </section>

        {/* Different Sizes */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Button Sizes
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* With Icons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Buttons with Icons
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Movie
            </Button>
            <Button variant="secondary">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Contact
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button variant="ghost">
              <Heart className="mr-2 h-4 w-4" />
              Like
            </Button>
            <Button variant="link">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </section>

        {/* Movie-themed Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Movie Theme Buttons
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Button className="bg-red-600 hover:bg-red-700">
              <Play className="mr-2 h-4 w-4" />
              Watch Now
            </Button>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
            <Button
              variant="secondary"
              className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            >
              <Star className="mr-2 h-4 w-4" />
              Rate Movie
            </Button>
            <Button
              variant="ghost"
              className="text-purple-600 hover:bg-purple-100"
            >
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Watchlist
            </Button>
          </div>
        </section>

        {/* Icon Only Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Icon Only Buttons
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button size="icon" variant="default">
              <Play className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary">
              <Heart className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <Settings className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost">
              <Share className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Loading States */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Loading States
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button disabled>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              Loading...
            </Button>
            <Button variant="secondary" disabled>
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              Processing
            </Button>
            <Button variant="outline" disabled>
              Disabled
            </Button>
          </div>
        </section>

        {/* Custom Styled Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Custom Styled Buttons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold">
              <Star className="mr-2 h-4 w-4" />
              Premium Feature
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Download className="mr-2 h-4 w-4" />
              Free Download
            </Button>
            <Button className="bg-black hover:bg-gray-800 text-white border-2 border-gray-700">
              <ArrowRight className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </div>
        </section>

        {/* Movie Action Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Movie Action Buttons
          </h2>
          <div className="bg-card p-6 rounded-lg border space-y-4">
            <h3 className="text-lg font-medium">Movie Control Panel</h3>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                <Play className="mr-2 size-5" />
                Watch Now
              </Button>
              <Button size="lg" variant="outline">
                <Plus className="mr-2 size-5" />
                Add to List
              </Button>
              <Button size="lg" variant="secondary">
                <Heart className="mr-2 size-5" />
                Favorite
              </Button>
              <Button size="lg" variant="ghost">
                <Share className="mr-2 size-5" />
                Share
              </Button>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Interactive Demo
          </h2>
          <div className="bg-card p-6 rounded-lg border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => alert("Button clicked!")}
                className="transition-transform hover:scale-105"
              >
                Click Me!
              </Button>
              <Button
                variant="secondary"
                onClick={() => console.log("Secondary clicked")}
                className="transition-transform hover:scale-105"
              >
                Console Log
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open("https://github.com", "_blank")}
                className="transition-transform hover:scale-105"
              >
                <ArrowRight className="mr-2 h-4 w-4" />
                External Link
              </Button>
              <Button
                variant="destructive"
                onClick={() => confirm("Are you sure?") && alert("Confirmed!")}
                className="transition-transform hover:scale-105"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Confirm Action
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
