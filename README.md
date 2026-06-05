# ClearNotes - AI Meeting Notetaker

ClearNotes is a full-stack application that uses AI to transcribe meeting recordings, generate summaries, and extract actionable items. Built with Next.js, FastAPI, and PostgreSQL.

## Features

- **Authentication**: Secure sign-up/login with email/password or Google OAuth
- **Meeting Upload**: Audio/video file upload with metadata
- **AI Transcription**: Automatic transcription using OpenAI Whisper
- **Smart Summaries**: AI-generated meeting summaries with GPT-4
- **Action Item Extraction**: Automatic detection and extraction of tasks and deadlines
- **Dashboard**: Overview of meetings, statistics, and pending action items
- **Email Notifications**: Configurable email alerts and daily digests
- **Integrations**: Google Calendar, Zoom, and third-party tools (Slack, Notion, etc.)

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- NextAuth.js for authentication
- Zustand for state management
- React Hot Toast for notifications

### Backend
- FastAPI (Python)
- SQLAlchemy ORM
- PostgreSQL database
- OpenAI API (Whisper, GPT-4)
- SMTP for email notifications

### Database
- PostgreSQL (via Prisma ORM)

## Project Structure

```
/
├── app/                    # Next.js app router
│   ├── api/               # API routes (meetings, action-items, upload, etc.)
│   ├── dashboard/         # Dashboard pages
│   │   ├── action-items/
│   │   ├── meetings/
│   │   ├── settings/
│   │   ├── upload/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── login/
│   ├── register/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/            # React components
│   ├── dashboard/
│   │   └── Sidebar.tsx
│   ├── AuthProvider.tsx
│   ├── Features.tsx
│   ├── Hero.tsx
│   └── ...
├── lib/                   # Utility functions
│   ├── auth.ts           # NextAuth config
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/
│   └── schema.prisma     # Database schema
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   └── process.py
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── ai.py
│   │       ├── email.py
│   │       └── transcription.py
│   ├── main.py
│   └── requirements.txt
├── public/               # Static assets
├── types/                # TypeScript types
├── .env.example          # Environment variables template
├── next.config.js
├── tailwind.config.ts
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- PostgreSQL database
- OpenAI API key

### Database Setup

1. Create a PostgreSQL database:
```bash
createdb clearnotes
```

2. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

### Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Fill in the required values:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/clearnotes"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Backend API
BACKEND_URL="http://localhost:8000"
API_KEY="your-api-key"

# OpenAI (for backend)
OPENAI_API_KEY="your-openai-api-key"

# Email SMTP (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
FROM_EMAIL="noreply@clearnotes.app"
```

### Running the Application

#### Option 1: Run Frontend and Backend Separately

**Terminal 1 - Frontend:**
```bash
npm install
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set environment variables or create .env file
cp .env.example .env

# Run the backend
uvicorn main:app --reload --port 8000
```

#### Option 2: Using Docker Compose (Recommended for production)

Create a `docker-compose.yml`:
```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: clearnotes
      POSTGRES_PASSWORD: password
      POSTGRES_DB: clearnotes
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://clearnotes:password@db:5432/clearnotes
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      - db
    ports:
      - "8000:8000"

  frontend:
    build: .
    environment:
      DATABASE_URL: postgresql://clearnotes:password@db:5432/clearnotes
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      BACKEND_URL: http://backend:8000
    depends_on:
      - db
      - backend
    ports:
      - "3000:3000"

volumes:
  postgres_data:
```

Then run:
```bash
docker-compose up --build
```

## Usage

1. **Sign Up**: Visit `/register` and create an account with email/password or Google OAuth
2. **Upload Meeting**: Go to `/dashboard/upload` and upload an audio/video file
3. **View Dashboard**: Check `/dashboard` for meeting statistics and recent activity
4. **View Meeting Details**: Click on a meeting to see transcription, summary, and action items
5. **Manage Action Items**: Visit `/dashboard/action-items` to view and manage all tasks
6. **Configure Settings**: Go to `/dashboard/settings` to set up email notifications and integrations

## API Endpoints

### Frontend API (Next.js)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/[...nextauth]` | Authentication |
| POST | `/api/register` | User registration |
| GET | `/api/meetings` | List meetings |
| POST | `/api/meetings` | Create meeting |
| GET | `/api/meetings/[id]` | Get meeting details |
| PATCH | `/api/meetings/[id]` | Update meeting |
| DELETE | `/api/meetings/[id]` | Delete meeting |
| GET | `/api/action-items` | List action items |
| POST | `/api/action-items` | Create action item |
| PATCH | `/api/action-items/[id]` | Update action item |
| DELETE | `/api/action-items/[id]` | Delete action item |
| POST | `/api/upload` | Upload meeting audio |
| GET | `/api/settings` | Get user settings |
| PATCH | `/api/settings` | Update user settings |

### Backend API (FastAPI)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/health` | Service status |
| POST | `/api/process/meeting` | Process meeting audio |
| POST | `/api/process/reprocess/{id}` | Reprocess meeting |
| POST | `/api/process/email-action-items` | Email action items |
| GET | `/api/meetings/{id}/status` | Get processing status |

## Development

### Adding New Features

1. **Database Schema Changes**: Update `prisma/schema.prisma` and run `npx prisma migrate dev`
2. **New API Routes**: Add files in `app/api/[route]/route.ts`
3. **New Pages**: Add folders in `app/dashboard/[page]/page.tsx`
4. **Backend Routes**: Add routers in `backend/app/routers/`

### Testing

Run tests with:
```bash
# Frontend tests
npm test

# Backend tests
cd backend
pytest
```

## Deployment

### Vercel (Frontend)

```bash
npm i -g vercel
vercel --prod
```

Configure environment variables in Vercel dashboard.

### Railway/Render (Backend)

1. Push code to GitHub
2. Connect Railway/Render to your repo
3. Set environment variables
4. Deploy

### Database

Use managed PostgreSQL services like:
- Railway
- Supabase
- Neon
- AWS RDS

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- GitHub Issues: Report bugs and feature requests
- Email: support@clearnotes.app

## Roadmap

- [ ] Real-time Zoom/Meet bot joining
- [ ] Calendar auto-sync
- [ ] Mobile app
- [ ] Team collaboration features
- [ ] Advanced analytics
- [ ] Slack/Discord notifications
- [ ] Multi-language support
