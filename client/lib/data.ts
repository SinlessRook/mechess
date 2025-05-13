import { Player,FeaturedGame } from "./types"

// Mock data for featured games
export const featuredGamesData: FeaturedGame[] = [
  {
    id: 1,
    white: "Magnus Carlsen",
    black: "Fabiano Caruana",
    event: "World Championship 2018",
    date: "2018-11-28",
    result: "1-0",
    moves: 55,
    opening: "Sicilian Defense",
    description: "A brilliant attacking game where Carlsen sacrificed material for a devastating kingside attack.",
    likes: 245,
    dislikes: 12,
    views: 12500,
    duration: "4h 12m",
    image: "/placeholder.svg?height=200&width=350",
    userLiked: false,
    userDisliked: false,
  },
  {
    id: 2,
    white: "Hikaru Nakamura",
    black: "Wesley So",
    event: "US Championship 2021",
    date: "2021-10-15",
    result: "½-½",
    moves: 67,
    opening: "Queen's Gambit Declined",
    description: "An incredible defensive masterpiece by So, saving a seemingly lost position against Nakamura.",
    likes: 189,
    dislikes: 8,
    views: 8700,
    duration: "3h 45m",
    image: "/placeholder.svg?height=200&width=350",
    userLiked: false,
    userDisliked: false,
  },
  {
    id: 3,
    white: "Ding Liren",
    black: "Ian Nepomniachtchi",
    event: "World Championship 2023",
    date: "2023-04-30",
    result: "1-0",
    moves: 68,
    opening: "Nimzo-Indian Defense",
    description: "The decisive game of the 2023 World Championship match, featuring a brilliant queen sacrifice.",
    likes: 312,
    dislikes: 15,
    views: 18200,
    duration: "5h 03m",
    image: "/placeholder.svg?height=200&width=350",
    userLiked: false,
    userDisliked: false,
  },
  {
    id: 4,
    white: "Garry Kasparov",
    black: "Veselin Topalov",
    event: "Wijk aan Zee 1999",
    date: "1999-01-20",
    result: "1-0",
    moves: 44,
    opening: "Pirc Defense",
    description: "Kasparov's famous 'Immortal Game' featuring one of the greatest combinations in chess history.",
    likes: 523,
    dislikes: 5,
    views: 45800,
    duration: "3h 22m",
    image: "/placeholder.svg?height=200&width=350",
    userLiked: false,
    userDisliked: false,
  },
  {
    id: 5,
    white: "Bobby Fischer",
    black: "Boris Spassky",
    event: "World Championship 1972",
    date: "1972-07-23",
    result: "1-0",
    moves: 41,
    opening: "Sicilian Defense",
    description: "Game 6 of the 'Match of the Century', showcasing Fischer's brilliant positional play.",
    likes: 478,
    dislikes: 7,
    views: 38900,
    duration: "2h 55m",
    image: "/placeholder.svg?height=200&width=350",
    userLiked: false,
    userDisliked: false,
  },
]

export const openings = [
  {
    name: "English Opening",
    sequence: [
      ["c2", "c4"], ["e7", "e5"], // c4, e5
      ["g1", "f3"], ["b8", "c6"], // Nf3, Nc6
      ["g2", "g3"], ["g8", "f6"], // g3, Nf6
      ["f1", "g2"], ["f8", "c5"], // Bg2, Bc5
    ],
    description: "A flexible and strategic flank opening that controls the center from the side.",
    eco: "A25"
  },
  {
    name: "King's Indian Defense",
    sequence: [
      ["d2", "d4"], ["g8", "f6"], // d4, Nf6
      ["c2", "c4"], ["g7", "g6"], // c4, g6
      ["g1", "f3"], ["f8", "g7"], // Nf3, Bg7
      ["e2", "e4"], ["d7", "d6"], // e4, d6
    ],
    description: "Black allows White to control the center initially, aiming to counterattack later.",
    eco: "E60"
  },
  {
    name: "Nimzo-Indian Defense",
    sequence: [
      ["d2", "d4"], ["g8", "f6"], // d4, Nf6
      ["c2", "c4"], ["e7", "e6"], // c4, e6
      ["g1", "f3"], ["b8", "c6"], // Nf3, Nc6
      ["b1", "c3"], ["f8", "b4"], // Nc3, Bb4
    ],
    description: "A hypermodern opening where Black pins the knight on c3 to control the center indirectly.",
    eco: "E20"
  },
  {
    name: "Queen's Gambit",
    sequence: [
      ["d2", "d4"], ["d7", "d5"], // d4, d5
      ["c2", "c4"], ["e7", "e6"], // c4, e6
      ["b1", "c3"], ["g8", "f6"], // Nc3, Nf6
    ],
    description: "White offers a pawn to gain control of the center and activate pieces.",
    eco: "D06"
  },
  {
    name: "Slav Defense",
    sequence: [
      ["d2", "d4"], ["d7", "d5"], // d4, d5
      ["c2", "c4"], ["c7", "c6"], // c4, c6
      ["g1", "f3"], ["g8", "f6"], // Nf3, Nf6
    ],
    description: "A solid defense against the Queen's Gambit with long-term strategic ideas.",
    eco: "D10"
  },
  {
    name: "Scandinavian Defense",
    sequence: [
      ["e2", "e4"], ["d7", "d5"], // e4, d5
      ["e4", "d5"], ["d8", "d5"], // exd5, Qxd5
      ["b1", "c3"], ["d5", "a5"], // Nc3, Qa5
    ],
    description: "An aggressive defense aiming to challenge White's center early with quick development.",
    eco: "B01"
  },
  {
    name: "Sicilian Defense",
    sequence: [
      ["e2", "e4"], ["c7", "c5"], // e4, c5
      ["g1", "f3"], ["d7", "d6"], // Nf3, d6
      ["d2", "d4"], ["c5", "d4"], // d4, cxd4
      ["f3", "d4"], ["g8", "f6"], // Nxd4, Nf6
      ["b1", "c3"], // Nc3
    ],
    description: "Black’s most popular response to e4, leading to dynamic and tactical play.",
    eco: "B20"
  },
  {
    name: "Caro-Kann Defense",
    sequence: [
      ["e2", "e4"], ["c7", "c6"], // e4, c6
      ["d2", "d4"], ["d7", "d5"], // d4, d5
      ["b1", "c3"], ["d5", "e4"], // Nc3, dxe4
      ["c3", "e4"], // Nxe4
    ],
    description: "A solid and resilient opening for Black, offering strong central control and structure.",
    eco: "B10"
  },
  {
    name: "Ruy Lopez",
    sequence: [
      ["e2", "e4"], ["e7", "e5"], // e4, e5
      ["g1", "f3"], ["b8", "c6"], // Nf3, Nc6
      ["f1", "b5"], ["a7", "a6"], // Bb5, a6
      ["b5", "a4"], ["f8", "c5"], // Ba4, Bc5
      ["e1", "g1"], ["h1", "f1"], // O-O
    ],
    description: "A classical opening where White puts pressure on Black's e5 pawn via Bb5.",
    eco: "C60"
  },
  {
    name: "Italian Game",
    sequence: [
      ["e2", "e4"], ["e7", "e5"], // e4, e5
      ["g1", "f3"], ["b8", "c6"], // Nf3, Nc6
      ["f1", "c4"], ["f8", "c5"], // Bc4, Bc5
    ],
    description: "An old opening that leads to open games and quick piece development.",
    eco: "C50"
  }
];
