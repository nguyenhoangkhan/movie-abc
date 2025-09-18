import Link from "next/link";
import { Film, Heart, Coffee } from "lucide-react";
import BuyMeCoffee from "@/components/BuyMeCoffee";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Film className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                movieABC
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              Your premium destination for streaming movies online. Discover
              thousands of movies across all genres with our free and premium
              plans.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/movies"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/buttons"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  UI Components
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              Support the Project
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              If you enjoy using movieABC, consider supporting the development!
            </p>
            <BuyMeCoffee variant="default" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 movieABC. Made with{" "}
            <Heart className="h-4 w-4 inline text-red-500" /> by the community.
          </p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className="text-muted-foreground text-sm">
              Powered by Next.js & Prisma
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
