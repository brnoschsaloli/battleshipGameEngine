import type { Cell, Board, Player } from "./types.js";

export function createCell(row: number, col: number): Cell {
    return {
        row: row,
        col: col,
        isHit: false,
        hasShip: false
    }
}

export function createBoard(): Board {
    const grid: Cell[][] = [];
    for (let i = 0; i < 10; i++) {
        const currentRow: Cell[] = [];
        for (let j = 0; j< 10; j++) {
            currentRow.push(createCell(i,j));
        }
        grid.push(currentRow);
    }
    return {
        grid: grid,
        ships: []
    }
}

export function createPlayer(name: string): Player {
    return {
        name: name,
        board: createBoard(),
        trackingBoard: createBoard()
    }
}