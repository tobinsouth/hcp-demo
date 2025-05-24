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

4. You may need to set up a local redis and prisma deployment if this is your first time. For example
    a. Install Redis:
    - On macOS (using Homebrew):
        ```bash
        brew install redis
        brew services start redis
        ```
    - On Linux:
        ```bash
        sudo apt-get install redis-server
        sudo systemctl start redis-server
        ```

   b. Set up Prisma:
   ```bash
   # Initialize the database
   pnpm prisma generate
   pnpm prisma db push
   ```

    Note: The project uses SQLite as the database provider (configured in prisma/schema.prisma), so no additional database installation is required. The database file will be created at `prisma/dev.db`.


5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the UI demo.

Once your AI client has picked up the server (e.g., Cursor:Settings/Cursor Settings/MCP) you can simple ask the agent to update your preferences.

## Connecting to MCP

The simplest way to access MCP servers is via Cursor. You will find the code requried to access a workspace MCP server in `.cursor/mcp.json`. If you do not have access to cursor as an MCP client, this JSON will work with any other client that supports MCP (e.g., claude desktop, goose). The `Connect to MCP` button in the demo explains more.

## Authentication Setup

The demo uses WorkOS AuthKit for authentication, implemented in `lib/with-authkit.ts`. For development and demonstration purposes, the authentication is simplified with a debug user. In production, you should:

1. Set up WorkOS AuthKit following their instructions [here](https://workos.com/docs/user-management/vanilla/nodejs). This will involve setting up an account, accessing keys, and setting a redirect URL. This does not need to be done for local demos.

Speficially, you will need to add to `.env` a `WORKOS_API_KEY`, `WORKOS_CLIENT_ID`, `WORKOS_COOKIE_PASSWORD`

2. Remove the debug user code in `lib/with-authkit.ts` by uncommenting the production authentication code and removing the debug user object.


## Project Structure

- `/app`: Next.js application routes and pages
- `/components`: React components
- `/lib`: Utility functions and database configuration
- `/prisma`: Database schema and migrations