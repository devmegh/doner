# Donato - Donation Platform

Donato is a full-featured donation platform where users can create, browse, and contribute to fundraising campaigns. The application empowers users to easily manage their donation activity and campaign creation through a modern, user-friendly interface.

## Features

- **User Authentication**: Secure sign-up and login functionality
- **Campaign Management**: Create, browse, and manage fundraising campaigns
- **Donation System**: Contribute to campaigns with custom donation amounts
- **Category Filtering**: Browse campaigns by predefined categories
- **User Profiles**: View donation history and created campaigns
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)

## Tech Stack

- **Frontend**: React.js, TailwindCSS, Shadcn UI Components
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **API**: RESTful API architecture
- **State Management**: React Query for server state
- **Form Handling**: React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/donato.git
cd donato
```

2. Install dependencies
```
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgresql://username:password@localhost:5432/donato
```

4. Set up the database
```
npm run db:push
```

5. Start the development server
```
npm run dev
```

6. Open http://localhost:5000 in your browser

## Project Structure

```
donato/
├── client/                 # Frontend code
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
├── server/                 # Backend code
│   ├── db.ts               # Database configuration
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage implementation
│   └── vite.ts             # Vite server configuration
├── shared/                 # Shared code between frontend and backend
│   └── schema.ts           # Database schema and types
├── migrations/             # Database migrations
├── components.json         # Shadcn UI configuration
├── drizzle.config.ts       # Drizzle ORM configuration
├── package.json            # Project dependencies
├── tailwind.config.ts      # Tailwind CSS configuration
└── vite.config.ts          # Vite configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get authenticated user

### Users
- `GET /api/users/:id` - Get user by ID

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign by ID
- `GET /api/campaigns/category/:category` - Get campaigns by category
- `GET /api/campaigns/creator/:creatorId` - Get campaigns by creator
- `POST /api/campaigns` - Create a new campaign
- `PATCH /api/campaigns/:id` - Update a campaign
- `DELETE /api/campaigns/:id` - Delete a campaign

### Donations
- `GET /api/donations/campaign/:campaignId` - Get donations by campaign
- `GET /api/donations/user/:userId` - Get donations by user
- `POST /api/donations` - Make a donation

### Categories
- `GET /api/categories` - Get all categories

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/)