# movieABC - Next.js 15 Movie Streaming Platform

A complete movie streaming website built with Next.js 15, featuring user authentication, quota management, premium subscriptions, and video streaming capabilities.

## 🚀 Features

### Core Features

- **User Authentication**: Register/Login with email & password using NextAuth.js
- **User Types**: Guest (limited access), Free (daily quota), Premium (unlimited)
- **Daily Quota System**: Free users get 5 daily views with bonus views from invites
- **Video Streaming**: Multiple resolution support (360p, 480p, 720p, FHD)
- **Premium Subscriptions**: Mock payment integration for upgrades
- **Adult Content**: Restricted access for authenticated users only
- **Invite System**: Users can invite friends for bonus views

### Technical Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Prisma ORM** with SQLite database
- **NextAuth.js** for authentication
- **Tailwind CSS 4.1** for styling
- **Protected Routes** with middleware
- **API Routes** for backend functionality
- **Responsive Design** for all devices

## 📁 Project Structure

```
movie-quan/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts
│   │   │   └── register/route.ts
│   │   ├── movies/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── user/
│   │   │   ├── profile/route.ts
│   │   │   ├── upgrade/route.ts
│   │   │   └── invite/route.ts
│   │   └── watch/[id]/route.ts
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── Navbar.tsx
│   ├── MovieCard.tsx
│   └── VideoPlayer.tsx
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── types/
│   └── index.ts
├── middleware.ts
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── .env.local
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ and npm/yarn
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd movie-quan
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Copy the environment variables and update them:

```bash
cp .env.local .env.local
```

Update `.env.local` with your values:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-here"

# Movie APIs (Optional - for external movie data)
NORMAL_MOVIE_API_KEY="your-tmdb-api-key"
ADULT_API_KEY="your-adult-api-key"

# Payment (Mock)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable"

# App Settings
FREE_DAILY_VIEWS=5
INVITE_BONUS_VIEWS=2
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Database Schema

The application uses the following main models:

- **User**: Store user information, plan type, and quota data
- **Movie**: Store movie details and video URLs
- **WatchHistory**: Track user viewing history
- **Invite**: Manage user invitations
- **Payment**: Record payment transactions

## 🔐 Authentication & Authorization

### User Types

1. **Guest**: Can browse limited movies, no adult content
2. **Free User**: 5 daily views, access to adult content, can invite friends
3. **Premium User**: Unlimited views, FHD quality, all features

### Protected Routes

- `/account`: Requires authentication
- `/admin`: Requires premium subscription
- Adult content: Requires authentication

## 🎬 Quota Management

### Daily Views

- Free users: 5 views per day (configurable)
- Reset at midnight
- Bonus views from successful invites
- Premium users: unlimited

### Resolution Access

- Guest/Free: Up to 720p
- Premium: Up to FHD (1080p)

## 📱 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (handled by NextAuth)

### Movies

- `GET /api/movies` - Get movies list with filters
- `GET /api/movies/[id]` - Get single movie details
- `POST /api/watch/[id]` - Start watching (quota check)

### User Management

- `GET /api/user/profile` - Get user profile
- `POST /api/user/upgrade` - Upgrade to premium
- `POST /api/user/invite` - Send invitation
- `GET /api/user/invite` - Get user's invitations

## 🎨 UI Components

### Reusable Components

- **Navbar**: Navigation with user menu
- **MovieCard**: Movie display card with ratings
- **VideoPlayer**: Custom video player with controls

### Styling

- Tailwind CSS 4.1 with custom design system
- Dark theme optimized
- Responsive design for mobile/desktop
- Custom animations and transitions

## 🚀 Deployment

### Prerequisites for Production

1. Set up a production database (PostgreSQL recommended)
2. Configure environment variables for production
3. Set up a domain and SSL certificate

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set up environment variables in Vercel dashboard
```

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📝 Default User Accounts

After running the seed script, you'll have these test accounts:

1. **Admin User**

   - Email: `admin@movieABC.com`
   - Password: `password123`
   - Plan: Premium

2. **Free User**
   - Email: `user@example.com`
   - Password: `password123`
   - Plan: Free

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema changes
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database
```

## 🌟 Features Roadmap

### Planned Features

- [ ] Real payment integration (Stripe)
- [ ] Email notifications for invites
- [ ] Movie recommendations
- [ ] Watch history and favorites
- [ ] Social features (reviews, ratings)
- [ ] Advanced admin dashboard
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@movieABC.com or join our Discord community.

---

**Note**: This is a demo application for educational purposes. Some features like payment processing use mock implementations and should be replaced with real services for production use.
