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
      title: "Fight Club",
      description:
        "An insomniac office worker and a devil-may-care soap maker form an underground fight club.",
      thumbnail:
        "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      duration: 139,
      releaseYear: 1999,
      rating: 8.8,
      genre: "Drama, Thriller",
      isAdult: false,
      videoUrls: JSON.stringify({
        "360p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
        "480p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
        "720p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        FHD: "https://sample-videos.com/zip/10/mp4/SampleVideo_1920x1080_2mb.mp4",
      }),
    },
    {
      title: "Forrest Gump",
      description:
        "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man.",
      thumbnail:
        "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
      duration: 142,
      releaseYear: 1994,
      rating: 8.8,
      genre: "Drama, Romance",
      isAdult: false,
      videoUrls: JSON.stringify({
        "360p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
        "480p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
        "720p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        FHD: "https://sample-videos.com/zip/10/mp4/SampleVideo_1920x1080_2mb.mp4",
      }),
    },
    {
      title: "Pulp Fiction",
      description:
        "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
      thumbnail:
        "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      duration: 154,
      releaseYear: 1994,
      rating: 8.9,
      genre: "Crime, Drama",
      isAdult: false,
      videoUrls: JSON.stringify({
        "360p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
        "480p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
        "720p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        FHD: "https://sample-videos.com/zip/10/mp4/SampleVideo_1920x1080_2mb.mp4",
      }),
    },
    {
      title: "Adult Content Sample",
      description: "This is adult content available only for registered users.",
      thumbnail: "https://via.placeholder.com/500x750/ff6b6b/ffffff?text=18%2B",
      duration: 90,
      releaseYear: 2023,
      rating: 7.5,
      genre: "Adult",
      isAdult: true,
      videoUrls: JSON.stringify({
        "360p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4",
        "480p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
        "720p":
          "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
        FHD: "https://sample-videos.com/zip/10/mp4/SampleVideo_1920x1080_2mb.mp4",
      }),
    },
  ];

  // Create sample movies
  for (const movieData of sampleMovies) {
    await prisma.movie.create({
      data: movieData,
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
