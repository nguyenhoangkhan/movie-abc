import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const hashedPassword = await bcrypt.hash("password123", 12);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@movieABC.com" },
    update: {},
    create: {
      email: "admin@movieABC.com",
      password: hashedPassword,
      name: "Admin User",
      plan: "PREMIUM",
      premiumUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    },
  });

  const freeUser = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      password: hashedPassword,
      name: "Free User",
      plan: "FREE",
      dailyViews: 3,
    },
  });

  // Create sample movies
  const sampleMovies = [
    {
      tmdbId: 550,
      title: "Fight Club",
      description:
        "An insomniac office worker and a devil-may-care soap maker form an underground fight club.",
      poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      backdrop:
        "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/52AfXWuXCHn3UjD17rBruA9f5qb.jpg",
      releaseDate: new Date("1999-10-15"),
      rating: 8.8,
      genre: ["Drama", "Thriller"],
      isAdult: false,
      videoUrls: {
        "360p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
        "480p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
        "720p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        FHD: "https://sample-videos.com/zip/10/mp4/SampleVideo_1920x1080_2mb.mp4",
      },
    },
    {
      tmdbId: 13,
      title: "Forrest Gump",
      description:
        "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.",
      poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
      backdrop:
        "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/7c9UVPPiTPltouxRVY6N9x3pLnK.jpg",
      releaseDate: new Date("1994-06-23"),
      rating: 8.8,
      genre: ["Drama", "Romance"],
      isAdult: false,
      videoUrls: {
        "360p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
        "480p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
        "720p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        FHD: "https://sample-videos.com/zip/10/mp4/SampleVideo_1920x1080_2mb.mp4",
      },
    },
    {
      tmdbId: 680,
      title: "Pulp Fiction",
      description:
        "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
      poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      backdrop:
        "https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg",
      releaseDate: new Date("1994-09-10"),
      rating: 8.9,
      genre: ["Crime", "Drama"],
      isAdult: false,
      videoUrls: {
        "360p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
        "480p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
        "720p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        FHD: "https://sample-videos.com/zip/10/mp4/SampleVideo_1920x1080_2mb.mp4",
      },
    },
    {
      tmdbId: 8001,
      title: "Adult Content Sample",
      description: "This is adult content available only for registered users.",
      poster: "https://via.placeholder.com/500x750/ff6b6b/ffffff?text=18%2B",
      backdrop:
        "https://via.placeholder.com/1920x800/ff6b6b/ffffff?text=Adult+Content",
      releaseDate: new Date("2023-01-01"),
      rating: 7.5,
      genre: ["Adult"],
      isAdult: true,
      videoUrls: {
        "360p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
        "480p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
        "720p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        FHD: "https://sample-videos.com/zip/10/mp4/SampleVideo_1920x1080_2mb.mp4",
      },
    },
  ];

  for (const movieData of sampleMovies) {
    await prisma.movie.upsert({
      where: { tmdbId: movieData.tmdbId },
      update: {},
      create: movieData,
    });
  }

  console.log("Database seeded successfully!");
  console.log("Admin user:", adminUser);
  console.log("Free user:", freeUser);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
