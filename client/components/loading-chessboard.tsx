import { useEffect, useRef, useState } from "react"
import { openings } from "@/lib/data"

type Piece = {
  symbol: string
  position: number[]
  color: string
}

// Helper function to convert chess notation (like "e2") to board coordinates (like [6, 4])
function toBoardCoordinates(notation: string): number[] {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"] // columns a-h
  const rank = parseInt(notation[1]) // e.g., 2 from "e2"
  const file = notation[0].toLowerCase() // e.g., "e" from "e2"

  const col = files.indexOf(file)
  const row = 8 - rank // Convert rank to 0-based row index

  return [row, col]
}

function getInitialPieces(): Piece[] {
  return [
    // White pieces
    { symbol: "♖", position: [7, 0], color: "white" }, // a1 rook
    { symbol: "♘", position: [7, 1], color: "white" }, // b1 knight
    { symbol: "♗", position: [7, 2], color: "white" }, // c1 bishop
    { symbol: "♕", position: [7, 3], color: "white" }, // d1 queen
    { symbol: "♔", position: [7, 4], color: "white" }, // e1 king
    { symbol: "♗", position: [7, 5], color: "white" }, // f1 bishop
    { symbol: "♘", position: [7, 6], color: "white" }, // g1 knight
    { symbol: "♖", position: [7, 7], color: "white" }, // h1 rook
    ...Array.from({ length: 8 }, (_, i) => ({ symbol: "♙", position: [6, i], color: "white" })), // a2-h2 pawns

    // Black pieces
    { symbol: "♜", position: [0, 0], color: "black" }, // a8 rook
    { symbol: "♞", position: [0, 1], color: "black" }, // b8 knight
    { symbol: "♝", position: [0, 2], color: "black" }, // c8 bishop
    { symbol: "♛", position: [0, 3], color: "black" }, // d8 queen
    { symbol: "♚", position: [0, 4], color: "black" }, // e8 king
    { symbol: "♝", position: [0, 5], color: "black" }, // f8 bishop
    { symbol: "♞", position: [0, 6], color: "black" }, // g8 knight
    { symbol: "♜", position: [0, 7], color: "black" }, // h8 rook
    ...Array.from({ length: 8 }, (_, i) => ({ symbol: "♟", position: [1, i], color: "black" })), // a7-h7 pawns
  ]
}



export function ChessLoader({ text = "Loading..." }: { text?: string }) {
  const [pieces, setPieces] = useState<Piece[]>(getInitialPieces)
  const piecesRef = useRef(pieces)
  const [activePiece, setActivePiece] = useState<number | null>(null)
  const [currentOpening, setCurrentOpening] = useState({
    name: "",
    description: "",
    moves: "",
    eco: ""
  })

  useEffect(() => {
    piecesRef.current = pieces
  }, [pieces])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const startOpening = () => {
      const index = Math.floor(Math.random() * openings.length)
      const opening = openings[index]
      setCurrentOpening({
        name: opening.name,
        description: opening.description,
        moves: "",
        eco: opening.eco
      })

      const initialPieces = getInitialPieces()
      setPieces(initialPieces)
      piecesRef.current = initialPieces

      let moveIndex = 0
      let moveHistory: string[] = []

      const playNext = () => {
        if (moveIndex >= opening.sequence.length) {
          timeout = setTimeout(() => startOpening(), 2000);
          return;
        }

        const [fromNotation, toNotation] = opening.sequence[moveIndex];
        const [fromRow, fromCol] = toBoardCoordinates(fromNotation);
        const [toRow, toCol] = toBoardCoordinates(toNotation);
        const current = piecesRef.current;

        // Find the piece that's moving (should be at from position)
        let pieceIndex = current.findIndex(
          (p) => p.position[0] === fromRow && p.position[1] === fromCol
        );

        if (pieceIndex !== -1) {
          const movingPiece = current[pieceIndex];
          const newPieces = [...current];

          // Remove captured piece if exists (at the to position)
          const capturedIndex = newPieces.findIndex(
            (p) => p.position[0] === toRow && p.position[1] === toCol &&
              p.color !== movingPiece.color // Ensure it's an opponent's piece
          );

          if (capturedIndex !== -1) {
            newPieces.splice(capturedIndex, 1);
            // If we removed a piece before our moving piece in the array,
            // we need to adjust the pieceIndex
            if (capturedIndex < pieceIndex) {
              pieceIndex -= 1;
            }
          }

          // Update moving piece position
          newPieces[pieceIndex] = {
            ...movingPiece,
            position: [toRow, toCol],
          };

          piecesRef.current = newPieces;
          setPieces(newPieces);
          setActivePiece(pieceIndex);
          setTimeout(() => setActivePiece(null), 400);

          // Update move history
          moveHistory.push(`${fromNotation}→${toNotation}`);
          setCurrentOpening((prev) => ({
            ...prev,
            moves: moveHistory.join(", "),
          }));
        }

        moveIndex += 1;
        timeout = setTimeout(playNext, 800);
      };

      timeout = setTimeout(playNext, 600)
    }

    startOpening()

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [])

  const board = Array(8).fill(0).map((_, row) =>
    Array(8).fill(0).map((_, col) => {
      const isWhite = (row + col) % 2 === 0
      const piece = pieces.find(p => p.position[0] === row && p.position[1] === col)
      const isActive = piece && pieces.indexOf(piece) === activePiece

      return (
        <div
          key={`${row}-${col}`}
          className={`chess-square ${isWhite ? "white" : "black"} ${isActive ? "active" : ""}`}
        >
          {piece && (
            <span className={`chess-piece ${piece.color} ${isActive ? "active" : ""}`}>
              {piece.symbol}
            </span>
          )}
        </div>
      )
    })
  )

  return (
    <>
    <div className="chess-loader flex flex-col items-center">
      <div className="flex items-start gap-4">
        <div className="chess-board-container">
          <div className="chess-board-labels">
            <div className="chess-col-labels">
              {["a", "b", "c", "d", "e", "f", "g", "h"].map(label => (
                <div key={label} className="chess-label">
                  {label}
                </div>
              ))}
            </div>
            <div className="chess-row-labels">
              {[8, 7, 6, 5, 4, 3, 2, 1].map(label => (
                <div key={label} className="chess-label">
                  {label}
                </div>
              ))}
            </div>
            <div className="chess-board">{board.flat()}</div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow w-64 text-center hidden md:block absolute md:right-12 md:top-12">
          <h2 className="text-lg text-amber-800 font-bold mb-2">
            {currentOpening.name || "Chess Openings"}
            {currentOpening.eco && <span className="text-sm text-gray-500 ml-2">({currentOpening.eco})</span>}
          </h2>
          <p className="text-gray-700 text-sm mb-2">
            {currentOpening.description || "Selecting opening..."}
          </p>
          <div className="text-xs text-gray-500 mt-2">
            {currentOpening.moves && (
              <>
                <div className="font-medium mb-1">Move sequence:</div>
                <div className="text-xs">{currentOpening.moves}</div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg shadow w-64 text-center md:hidden">
          <h2 className="text-lg text-amber-800 font-bold mb-2">
            {currentOpening.name || "Chess Openings"}
            {currentOpening.eco && <span className="text-sm text-gray-500 ml-2">({currentOpening.eco})</span>}
          </h2>
          <p className="text-gray-700 text-sm mb-2">
            {currentOpening.description || "Selecting opening..."}
          </p>
          <div className="text-xs text-gray-500 mt-2">
            {currentOpening.moves && (
              <>
                <div className="font-medium mb-1">Move sequence:</div>
                <div className="text-xs">{currentOpening.moves}</div>
              </>
            )}
          </div>
        </div>
      <div className="chess-loader-text mt-4 text-xl text-center">{text}</div>
    </div>
    </>
  )
}
