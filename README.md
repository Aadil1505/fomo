# FOMO Calculator

A simple investment calculator that helps you visualize what your stock investments could have been worth. Perfect for those "what if I had invested in..." moments.

## Features

- Search for any stock by ticker symbol or company name
- Calculate historical investment returns
- Interactive charts showing your investment growth over time
- Fun statistics about your potential gains
- Clean, modern interface with dark mode support
- No authentication required

## Getting Started

### Prerequisites

- Node.js 18+ or Bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd fomo
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. **Search for a stock**: Type a company name or ticker symbol (e.g., "Apple" or "AAPL")
2. **Select your investment amount**: Enter how much you would have invested
3. **Choose your dates**: Pick a start date (when you would have bought) and optionally an end date (defaults to today)
4. **Calculate**: Click the calculate button to see your results

The app will show you:
- How many shares you would have bought
- What your investment would be worth now
- Your total gain/loss
- An interactive chart of your investment over time

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Recharts](https://recharts.org/) - Data visualization
- [Yahoo Finance API](https://finance.yahoo.com/) - Stock data

## Building for Production

```bash
npm run build
npm start
```

## License

MIT
