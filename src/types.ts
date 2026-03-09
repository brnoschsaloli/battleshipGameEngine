export type Turn = "player" | "computer";

export interface Cell {
    row: number;
    col: number;
    isHit: boolean;
    hasShip: boolean;
}

export interface Ship {
    name: string;
    size: number;
    cells: Cell[];
    isSunk: boolean;
}

export interface Board {
    grid: Cell[][];
    ships: Ship[];
}

export interface Player {
    name: string;
    board: Board;
    trackingBoard: Board;
}

export interface GameState {
    turn: Turn;
    players: [Player, Player];
    isOver: boolean;
}