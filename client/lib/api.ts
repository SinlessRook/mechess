import {  featuredGamesData } from "./data";
import type { Player, FeaturedGame, playerFormatted } from "./types";
import axiosinstance from "./axios";

// Simulate network delay (in milliseconds)
const SIMULATED_DELAY = 1200;

// Cache duration (in milliseconds)
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

// Cache keys
const CACHE_KEYS = {
  ALL_PLAYERS: "chess_tournament_all_players",
  PLAYER_DETAILS: (id: number) => `chess_tournament_player_${id}`,
  FEATURED_GAMES: "chess_tournament_featured_games",
  LEADERBOARD: "chess_tournament_leaderboard",
};

// Cache interface
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// Check if cache is valid
const isCacheValid = <T>(cacheKey: string): { isValid: boolean; data?: T } => {
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (!cachedData) return { isValid: false };

    const parsedCache = JSON.parse(cachedData) as CacheItem<T>;
    const now = new Date().getTime();

    if (now - parsedCache.timestamp < CACHE_DURATION) {
      return { isValid: true, data: parsedCache.data };
    }

    return { isValid: false };
  } catch (error) {
    console.error("Cache error:", error);
    return { isValid: false };
  }
};

// Set cache
const setCache = <T>(cacheKey: string, data: T): void => {
  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
  } catch (error) {
    console.error("Error setting cache:", error);
  }
};

// Simulate API request with delay
const simulateRequest = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, SIMULATED_DELAY);
  });
};

// API functions
export const api = {
  // Get all players
  getPlayers: async () => {
    const cache = isCacheValid<Player[]>(CACHE_KEYS.ALL_PLAYERS);
    if (cache.isValid && cache.data) {
      return cache.data;
    }

    const res = await axiosinstance.get("/players/details/");
    const data = res.data;
    setCache(CACHE_KEYS.ALL_PLAYERS, data);
    return data;
  },

  // Get player by ID
  getPlayerById: async (id: number) => {
    const cacheKey = CACHE_KEYS.PLAYER_DETAILS(id);
    const cache = isCacheValid<Player>(cacheKey);
    if (cache.isValid && cache.data) {
      return cache.data;
    }
    // Get player list from global cache (not re-fetching)
    const playerListCache = isCacheValid<Player[]>(CACHE_KEYS.ALL_PLAYERS);
    let test1: Player[];

    if (playerListCache.isValid && playerListCache.data) {
      test1 = playerListCache.data;
    } else {
      const res1 = await axiosinstance.get<Player[]>("/players/details/");
      test1 = res1.data;
      setCache(CACHE_KEYS.ALL_PLAYERS, test1);
    }
    const res2 = await axiosinstance.get(`/players/details/${id}`);
    const test2: playerFormatted = res2.data;
    const player = (test1).find(p => p.id === id);
    if (!player) {
      throw new Error(`Player with ID ${id} not found`);
    }
    player.stats.openings = test2.openings;
    player.recentGames = test2.recentGames;
    const data = player;
    setCache(cacheKey, data);
    return data;
  },

  // Get featured games
  getFeaturedGames: async () => {
    const cache = isCacheValid<FeaturedGame[]>(CACHE_KEYS.FEATURED_GAMES);
    if (cache.isValid && cache.data) {
      return cache.data;
    }

    const res = await axiosinstance.get("/featured/games/");
    const data = res.data;
    setCache(CACHE_KEYS.FEATURED_GAMES, data);
    return data;
  },

  // Get leaderboard data
  getLeaderboard: async () => {
    const cache = isCacheValid<any>(CACHE_KEYS.LEADERBOARD);
    if (cache.isValid && cache.data) {
      return cache.data;
    }
    const res = await axiosinstance.get("/leaderboard/points/")
    const data = res.data
    setCache(CACHE_KEYS.LEADERBOARD, data);
    return data;
  },

// Clear all cache
clearCache: () => {
  try {
    // Remove static keys
    Object.values(CACHE_KEYS).forEach(key => {
      if (typeof key === 'string') {
        localStorage.removeItem(key);
      }
    });

    // Remove dynamic player cache keys
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("chess_tournament_player_")) {
        localStorage.removeItem(key);
      }
    });
    
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
}}

// Utility to handle API errors
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

// Utility to refresh API component
export const refreshApiComponent = async (component: "players" | "playerDetails" | "featuredGames" | "leaderboard") => {
  switch (component) {
    case "players":
      localStorage.removeItem(CACHE_KEYS.ALL_PLAYERS);
      await api.getPlayers();
      break;

    case "playerDetails":
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("chess_tournament_player_")) {
          localStorage.removeItem(key);
        }
      });
      break;

    case "featuredGames":
      localStorage.removeItem(CACHE_KEYS.FEATURED_GAMES);
      await api.getFeaturedGames();
      break;

    case "leaderboard":
      localStorage.removeItem(CACHE_KEYS.LEADERBOARD);
      await api.getLeaderboard();
      break;

    default:
      console.warn("Unknown component for refresh");
  }
};