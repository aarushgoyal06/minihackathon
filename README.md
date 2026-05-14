# 🔥 AI Roast Generator

A polished web app that creates funny, personalized, non-offensive roasts based on user input — powered by OpenAI.

## Features

- **User Input Form** — Name, occupation, hobbies, favorite apps, habits, personality traits, and an embarrassing fact
- **Roast Intensity Selector** — Mild 😊, Medium 🌶️, or Savage 🔥
- **AI-Generated Roasts** — 4 unique roast lines + a mic-drop closing line via OpenAI GPT-4o mini
- **Compliment Sandwich Mode** — Wrap your roast with a kind intro and outro
- **Shareable Output** — Copy to clipboard, download as PNG, or share natively
- **Roast History** — Stores your last 10 roasts locally in the browser
- **Safety Filters** — Avoids hate speech, discriminatory language, and sensitive topics
- **Dark Neon UI** — Animated loading, shimmer text, glowing cards

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **AI**: OpenAI API (GPT-4o mini)
- **Storage**: LocalStorage
- **Download**: html2canvas

## Getting Started

### Prerequisites

- Node.js 18+
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Installation

```bash
# Clone the repo
git clone https://github.com/aarushgoyal06/minihackathon.git
cd minihackathon

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local and add your OPENAI_API_KEY
```

### Environment Variables

Create a `.env.local` file:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add `OPENAI_API_KEY` in Vercel Environment Variables
4. Deploy!

## Usage

1. Fill in your profile (at least one field required)
2. Choose your roast intensity
3. Optionally enable Compliment Sandwich mode
4. Click **Roast Me!** and brace yourself 😈
5. Copy, download, or share your roast
