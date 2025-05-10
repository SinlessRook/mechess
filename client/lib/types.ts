export type Player = {
    id: number;
    name: string;
    country: string;
    rating: number;
    title: string;
    age: number;
    wins: number;
    losses: number;
    draws: number;
    performance: string; // e.g., "+58", "-5"
    trend: "up" | "down";
    achievements: string[];
    bio: string;
    tournaments: string[];
    recentGames: {
      opponent: string;
      result: "1-0" | "0-1" | "½-½";
      date: string; // ISO format
      event: string;
    }[];
    stats: {
      yearlyRating: {
        year: number;
        rating: number;
      }[];
      openings: {
        name: string;
        games: number;
        winRate: number; // in percentage
      }[];
      performance: {
        bullet: {
          games: number;
          winRate: number;
          drawRate: number;
          lossRate: number;
        };
        rapid: {
          games: number;
          winRate: number;
          drawRate: number;
          lossRate: number;
        };
        blitz: {
          games: number;
          winRate: number;
          drawRate: number;
          lossRate: number;
        };
      };
    };
  };

  export type playerFormatted = {
    openings: {
      name: string;
      games: number;
      winRate: number; // in percentage
    }[];
    recentGames: {
      opponent: string;
      result: "1-0" | "0-1" | "½-½";
      date: string; // ISO format
      event: string;
    }[];
    yearlyRating: {
      year: number;
      rating: number;
    }[];
  }
  export type FeaturedGame = {
    id: number;
    white: string;
    black: string;
    event: string;
    date: string; // ISO date string (e.g., "2023-04-30")
    result: "1-0" | "0-1" | "½-½"; // restrict to chess result notation
    moves: number;
    opening: string;
    description: string;
    likes: number;
    dislikes: number;
    views: number;
    duration: string; // Format: "Xh Ym"
    image: string;
    userLiked: boolean;
    userDisliked: boolean;
  };
  