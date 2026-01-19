# TradeOn 🚀

A cryptocurrency trading simulation game that evolved from a console-based Java application to a full-stack web application. Practice trading strategies with long and short positions in a risk-free environment featuring real market dynamics.

## 🎮 Overview

TradeOn is an educational trading simulator where players start with $1,000,000 virtual capital and 160 turns to maximize their portfolio value. The game features:

- **Long & Short Trading**: Buy low, sell high or short sell to profit from declining prices
- **Real-time Market Simulation**: Dynamic crypto market with price fluctuations
- **Position Management**: Track multiple open positions across different cryptocurrencies
- **Leaderboard System**: Compete with other players globally
- **Persistent Saves**: Continue your trading journey across sessions

## 🏗️ Project Structure

This repository contains two versions of the game:

### Console Version (`src/`)
Original Java-based terminal application with:
- Command-line interface
- File-based save system
- Market simulation engine
- Position tracking and trade execution

### Web Version (`web/`)
Modern Next.js web application featuring:
- Interactive UI with real-time charts
- NextAuth authentication
- MongoDB for user data and leaderboards
- Responsive design with Tailwind CSS
- State management with Zustand

## 🚀 Getting Started

### Prerequisites
- **For Console Version**: Java JDK 8 or higher
- **For Web Version**: Node.js 18+ and npm/yarn

### Running the Console Version

```bash
# Navigate to project root
cd TradeOn

# Compile Java files
javac src/*.java

# Run the game
java src.Main
```

### Running the Web Version

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Set up environment variables
# Create .env.local with:
# - MONGODB_URI
# - NEXTAUTH_SECRET
# - NEXTAUTH_URL

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🎯 Game Mechanics

### Starting Capital
Players begin with **$1,000,000** (loan shark money) and must maximize returns within 160 turns.

### Trading Options
- **Long Positions**: Buy cryptocurrency hoping prices will rise
- **Short Positions**: Borrow and sell crypto, profiting when prices fall

### Market Dynamics
- Multiple cryptocurrencies with unique volatility profiles
- Price movements based on market simulation algorithms
- Historical price tracking for trend analysis

### Win Conditions
- Maximize portfolio value before turns run out
- Avoid bankruptcy (portfolio value drops below debt threshold)
- Compete for top positions on the global leaderboard

## 🛠️ Tech Stack

### Console Application
- **Language**: Java
- **I/O**: Scanner, File-based persistence
- **Architecture**: MVC pattern with controller, model entities

### Web Application
- **Framework**: Next.js 16 (React 18)
- **Language**: TypeScript
- **Authentication**: NextAuth v5
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State**: Zustand
- **Icons**: Lucide React

## 📦 Key Components

### Java Classes
- `GameController`: Main game loop and user interaction
- `Market`: Cryptocurrency market simulation
- `Player`: Player stats and portfolio management
- `Trade`, `LongTrade`, `ShortTrade`: Trading logic
- `PositionManager`: Open position tracking
- `PriceHistoryLoader`: Historical data management

### React Components
- `GameClient`: Main game interface
- `MarketTable`: Live cryptocurrency prices
- `TradePanel`: Execute trades
- `PositionsPanel`: Manage open positions
- `PriceChart`: Historical price visualization
- `Leaderboard`: Global rankings

## 🔐 Authentication

The web version supports:
- NextAuth integration for secure login
- Demo mode for trying the game without registration
- Session-based user state management

## 💾 Data Persistence

### Console Version
- Local file-based saves (`game_save.dat`)
- Price history tracking (`price_history.txt`)
- Trade records export

### Web Version
- MongoDB collections for:
  - User profiles
  - Game saves
  - Leaderboard entries
  - Trade history

## 🎨 Features

- 📊 Interactive price charts
- 📈 Real-time portfolio value tracking
- 🏆 Global leaderboard
- 💰 Detailed position management
- 📱 Responsive mobile design
- 🎯 Market insider feature (limited attempts)
- 💾 Auto-save functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

See [LICENSE](LICENSE) file for details.

## 🎓 Educational Purpose

This project is designed for educational purposes to help users understand:
- Market mechanics and trading strategies
- Long vs short position dynamics
- Risk management principles
- Software development from console to web

---

**Note**: This is a simulation game. No real money or cryptocurrency is involved.
