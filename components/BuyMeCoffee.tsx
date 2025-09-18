"use client";

import { Coffee, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BuyMeCoffeeProps {
  variant?: "default" | "small" | "icon";
  className?: string;
  username?: string; // Ko-fi or Buy Me a Coffee username
}

export default function BuyMeCoffee({
  variant = "default",
  className = "",
  username = "nguyenhoangkhan", // Default username
}: BuyMeCoffeeProps) {
  const handleBuyMeCoffee = () => {
    // You can change this to your preferred platform:
    // Ko-fi: https://ko-fi.com/username
    // Buy Me a Coffee: https://www.buymeacoffee.com/username
    // GitHub Sponsors: https://github.com/sponsors/username

    const kofiUrl = `https://ko-fi.com/${username}`;
    window.open(kofiUrl, "_blank", "noopener,noreferrer");
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBuyMeCoffee}
        className={`text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 ${className}`}
        title="Buy me a coffee"
      >
        <Coffee className="size-5" />
      </Button>
    );
  }

  if (variant === "small") {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleBuyMeCoffee}
        className={`text-orange-500 border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-orange-800 dark:hover:bg-orange-950 ${className}`}
      >
        <Coffee className="h-4 w-4 mr-2" />
        Support
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleBuyMeCoffee}
      className={`text-orange-500 border-orange-200 hover:bg-orange-50 hover:text-orange-600 dark:border-orange-800 dark:hover:bg-orange-950 transition-all duration-200 ${className}`}
    >
      <Coffee className="h-4 w-4 mr-2" />
      Buy me a coffee
      <ExternalLink className="h-3 w-3 ml-2 opacity-60" />
    </Button>
  );
}
