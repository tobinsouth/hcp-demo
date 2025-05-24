# Human Context Protocol (HCP)

A research demo of the Human Context Protocol, introduced in "Robust AI Personalization Will Require a Human Context Protocol", a paper under review at NeurIPS 2025.

## Running the Demo

1. Clone the repository
2. Install dependencies:
```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install project dependencies
pnpm install
```

3. Set up environment variables:
```bash
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL="file:./dev.db"
```

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the UI demo.

## Authentication Setup

The demo uses WorkOS AuthKit for authentication, implemented in `lib/with-authkit.ts`. For development and demonstration purposes, the authentication is simplified with a debug user. In production, you should:

1. Set up WorkOS AuthKit following their instructions [here](https://workos.com/docs/user-management/vanilla/nodejs). This will involve setting up an account, accessing keys, and setting a redirect URL. This does not need to be done for local demos.

2. Remove the debug user code in `lib/with-authkit.ts` by uncommenting the production authentication code and removing the debug user object.


## Project Structure

- `/app`: Next.js application routes and pages
- `/components`: React components
- `/lib`: Utility functions and database configuration
- `/prisma`: Database schema and migrations

## Technical Implementation

- **Framework**: Next.js 14
- **Authentication**: WorkOS AuthKit
- **Database**: Prisma with SQLite
- **AI**: OpenAI GPT-4
- **Styling**: Tailwind CSS
- **Protocol**: Model Context Protocol (MCP)

## Deployment

The demo can be deployed on Vercel:

1. Push your code to a Git repository
2. Import the project in Vercel
3. Configure the required environment variables
4. Deploy
