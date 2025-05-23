# Human Context Protocol (HCP)

A Next.js application that implements the Human Context Protocol, providing a personalized experience through user preferences and AI-powered natural language interaction.

## Features

- **User Preferences Management**: Store and manage user preferences including:
  - Display name
  - Language preferences
  - Communication tone
  - Personal interests
  - API keys

- **Natural Language Interface**: Interact with preferences using natural language through MCP tools:
  - `addPreference`: Add or update preferences using natural language
  - `removePreference`: Remove or clear specific preferences
  - `findPreference`: Search and retrieve preference information

- **Authentication**: Secure user authentication using WorkOS AuthKit
- **Database**: Persistent storage using Prisma with SQLite
- **AI Integration**: OpenAI-powered natural language processing for preference management

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL="file:./dev.db"
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app`: Next.js application routes and pages
- `/components`: React components
- `/lib`: Utility functions and database configuration
- `/prisma`: Database schema and migrations

## Technology Stack

- **Framework**: Next.js 14
- **Authentication**: WorkOS AuthKit
- **Database**: Prisma with SQLite
- **AI**: OpenAI GPT-4
- **Styling**: Tailwind CSS
- **Protocol**: Model Context Protocol (MCP)

## Development

The application uses the following key technologies:

- `@vercel/mcp-adapter`: For MCP tool implementation
- `@workos-inc/authkit-nextjs`: For authentication
- `openai`: For natural language processing
- `prisma`: For database management

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [WorkOS AuthKit Documentation](https://workos.com/docs/reference/authkit)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Prisma Documentation](https://www.prisma.io/docs)

## Deployment

The application can be deployed on Vercel:

1. Push your code to a Git repository
2. Import the project in Vercel
3. Configure the required environment variables
4. Deploy

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
