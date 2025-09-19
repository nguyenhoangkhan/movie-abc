"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { User, LogOut, Settings, Menu, X, Film, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import BuyMeCoffee from "@/components/BuyMeCoffee";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const getLinkClasses = (path: string, isMobile = false) => {
    const baseClasses = isMobile
      ? "block px-3 py-2 transition-colors"
      : "transition-colors";

    const activeClasses = isActive(path)
      ? "text-primary font-semibold"
      : "text-foreground hover:text-primary";

    return `${baseClasses} ${activeClasses}`;
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">
                movieABC
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={getLinkClasses("/")}>
              Home
            </Link>
            <Link href="/movies" className={getLinkClasses("/movies")}>
              Movies
            </Link>
            {session && (
              <Link
                href="/movies?adult=true"
                className={getLinkClasses("/movies")}
              >
                Adult
              </Link>
            )}

            {/* Buy Me a Coffee */}
            <BuyMeCoffee variant="small" />

            {/* User Menu */}
            {status === "loading" ? (
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
            ) : session ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  <User className="size-5" />
                  <span className="hidden lg:block">{session.user?.name}</span>
                  {session.user?.plan === "PREMIUM" && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </Button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/account"
                      className="flex items-center px-4 py-2 text-sm text-foreground hover:bg-accent"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Account
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-start px-4 py-2 text-sm"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              <Link
                href="/"
                className={getLinkClasses("/", true)}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/movies"
                className={getLinkClasses("/movies", true)}
                onClick={() => setIsMenuOpen(false)}
              >
                Movies
              </Link>
              {session && (
                <Link
                  href="/movies?adult=true"
                  className={getLinkClasses("/movies", true)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Adult
                </Link>
              )}

              {/* Buy Me a Coffee for Mobile */}
              <div className="px-3 py-2">
                <BuyMeCoffee variant="small" />
              </div>

              {session ? (
                <>
                  <Link
                    href="/account"
                    className={getLinkClasses("/account", true)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Account
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className="w-full justify-start px-3 py-2"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={getLinkClasses("/login", true)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className={getLinkClasses("/register", true)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
