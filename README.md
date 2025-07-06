# Twilio Voicemail Simulation Service

A NestJS backend service that manages temporary phone number sessions for Twilio voicemail simulations. When users call an assigned phone number, they hear a custom greeting message. Phone numbers are automatically recycled based on session expiration without requiring cron jobs.

## Features

- 🔒 **Transaction-safe phone number assignment** using PostgreSQL row-level locking
- 📞 **Twilio webhook integration** for handling incoming calls
- ⏰ **Automatic phone number recycling** based on expiration timestamps
- 🛡️ **Twilio signature validation** for webhook security
- 🗄️ **Drizzle ORM** for type-safe database operations
- 🚀 **Built with NestJS** for scalable architecture

## Tech Stack

- **Framework**: NestJS v11
- **Database**: PostgreSQL with Drizzle ORM
- **Phone Service**: Twilio API
- **Language**: TypeScript
- **Validation**: class-validator & class-transformer

## Prerequisites

- Node.js v18+ 
- PostgreSQL database
- Twilio account with phone numbers
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bluff-my-backaccount
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/voicemail_db

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

# Application Environment
NODE_ENV=development
PORT=3000
```

4. Run database migrations:
```bash
npm run db:generate
npm run db:migrate
```

5. Seed the database with phone numbers:
```bash
npm run db:seed
```

## Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Database Management
```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

## API Endpoints

### Create Session
```http
POST /sessions/create
Content-Type: application/json

{
  "userId": "user123",
  "greetingUrl": "https://example.com/greeting.mp3",
  "expiresInMinutes": 30  // optional, default: 30
}

Response:
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "phoneNumber": "+1234567890",
    "expiresAt": "2024-01-01T12:30:00.000Z"
  }
}
```

### Handle Incoming Call (Twilio Webhook)
```http
POST /twilio/incoming-call
X-Twilio-Signature: <signature>

# Twilio will send form data with call details
# Returns TwiML response
```

### Expire Session Manually
```http
POST /sessions/:id/expire

Response:
{
  "success": true,
  "message": "Session expired successfully"
}
```

## Database Schema

### phone_numbers
- `id` (UUID) - Primary key
- `number` (string) - Unique phone number
- `expires_at` (timestamp) - When the number becomes available

### user_sessions
- `id` (UUID) - Primary key
- `user_id` (string) - User identifier
- `phone_number_id` (UUID) - Foreign key to phone_numbers
- `greeting_url` (string) - URL to greeting audio file
- `expires_at` (timestamp) - Session expiration time

## How It Works

1. **Session Creation**: When a user requests a session, the system:
   - Starts a database transaction
   - Finds an available phone number (where `expires_at` is null or in the past)
   - Uses `SELECT ... FOR UPDATE SKIP LOCKED` to prevent race conditions
   - Updates the phone number's `expires_at` timestamp
   - Creates a session record
   - Returns the assigned phone number

2. **Incoming Calls**: When someone calls an assigned number:
   - Twilio sends a webhook to `/twilio/incoming-call`
   - The system validates the Twilio signature
   - Looks up the active session for the phone number
   - Returns TwiML to play the greeting and hang up

3. **Number Recycling**: Numbers become available automatically when:
   - The `expires_at` timestamp passes
   - A session is manually expired via the API

## Security

- **Twilio Signature Validation**: All webhook requests are validated using the `X-Twilio-Signature` header
- **Environment Variables**: Sensitive credentials are stored in environment variables
- **Input Validation**: All API inputs are validated using DTOs and class-validator

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Development

### Linting
```bash
npm run lint
```

### Type Checking
The project uses TypeScript with strict type checking. Build errors will catch type issues:
```bash
npm run build
```

## Deployment Considerations

1. Ensure PostgreSQL connection pooling is configured for production
2. Set `NODE_ENV=production` in production environment
3. Configure Twilio webhook URLs to point to your production domain
4. Use HTTPS for all webhook endpoints
5. Consider implementing rate limiting for the session creation endpoint

## License

This project is [MIT licensed](LICENSE).