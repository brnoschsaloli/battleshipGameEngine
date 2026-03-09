import type { Board, Cell} from "./types.js";

export function parseInput(input: string): [number, number] | null{
    const upper = input.trim().toUpperCase();
    if (upper.length != 2) return null;
    const l = upper[0]!;
    const n = upper[1]!;

    if (l >= "A" && l <= "J") {
        const row = l.charCodeAt(0) - "A".charCodeAt(0); // = 0
        const col = Number(n);
        if (isNaN(col) || col < 0 || col > 9) return null
        return [row, col];

    } else return null;
}

function cellSymbol(cell: Cell, hideShips: boolean): string {
    if (cell.isHit && cell.hasShip) return "X";
    if (cell.isHit && !cell.hasShip) return "O";
    if (!hideShips && cell.hasShip) return "#";
    return "~";
}

export function printBoard(board: Board, hideShips: boolean): void{
    const grid = board.grid;
    
    for (let i = -1; i < 10; i++) {
        for (let j = -1; j < 10; j++) {
            if (i === -1 && j === -1){
                process.stdout.write("  ");
            }else if (i == -1){
                process.stdout.write(String(j) + " ");
            }else if (j == -1){
                const letter = String.fromCharCode("A".charCodeAt(0) + i);
                process.stdout.write(letter + " ");
            }else{
                const cell = grid[i]![j]!;
                process.stdout.write(cellSymbol(cell, hideShips) + " ");
            }
        }
        process.stdout.write("\n");
    }
}