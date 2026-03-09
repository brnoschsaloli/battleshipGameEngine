import { fireShot, placeShip } from "./game.js";
import type { Cell, Board, Player, Ship } from "./types.js";

export function randomPlaceShip(board: Board, ship: Ship): void {
    while (true) {
        const row = Math.floor(Math.random() * 10); // between 0 and 9 -> random() produces a random float between 0 and 1
        const col = Math.floor(Math.random() * 10);
        const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";

        if (placeShip(board, ship, row, col, orientation)) break; // tenta placeShip ate dar certo
    }
}

export function randomFireShot(board: Board): boolean {
    while (true) {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);

        if (fireShot(board, row, col)) {
            if (board.grid[row]![col]!.hasShip) return true;
            else return false;
        }
    }
}

let targetQueue: [number, number][] = []; // cells to try next
// This is a **queue** — when the AI gets a hit, it adds all 4 adjacent cells to the queue. Next turn it pops from the queue instead of shooting randomly.
// The four adjacent cells of `[row, col]` are:
// [row-1, col]  // up
// [row+1, col]  // down
// [row, col-1]  // left
// [row, col+1]  // right

export function smartFireShot(board: Board): boolean {
    let row: number;
    let col: number;

    while (true) {
        if (targetQueue.length > 0) {
            [row, col] = targetQueue.pop()!;
        } else {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
        }

        if (fireShot(board, row, col)) {
            
            if (board.grid[row]![col]!.hasShip) {
                targetQueue.push([row-1, col]);
                targetQueue.push([row+1, col]);
                targetQueue.push([row, col-1]);
                targetQueue.push([row, col+1]);
                return true;
            } 
            else return false;
        }
    }
}