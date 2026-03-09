import type { Cell, Board, Player, Ship } from "./types.js";

export function placeShip(
    board: Board, 
    ship: Ship, 
    startRow: number, 
    startCol: number, 
    orientation: "horizontal" | "vertical"
): boolean {
    const size = ship.size;
    const grid = board.grid;

    for (let i = 0; i < size; i++) {
        const row = orientation === "horizontal" ? startRow : startRow + i;
        const col = orientation === "horizontal" ? startCol + i : startCol;
        const cell = grid[row]?.[col]; // _?. only access the grid[x] if its not undefined

        //check if its within bounds
        if (cell == undefined) return false; // _!cell works
        //check if its overlapping other ships
        if (cell.hasShip) return false;
    }

    for (let i = 0; i < size; i++) {
        const row = orientation === "horizontal" ? startRow : startRow + i;
        const col = orientation === "horizontal" ? startCol + i : startCol;
        const cell = grid[row]![col]!; // _! = "trust me, this is not undefined"

        cell.hasShip = true; //already inside board's grid
        ship.cells.push(cell);

    }

    board.ships.push(ship);
    return true;
}

export function fireShot(board: Board, row: number, col: number): boolean {
    const grid = board.grid;
    const cell = grid[row]?.[col];
    
    if (!cell) return false;
    
    if (cell.isHit) return false;
    else {
        cell.isHit = true;
        
        const ship = board.ships.find(s => s.cells.includes(cell))
        if (ship) {
            ship.isSunk = checkSunk(ship);
        }
        return true
    }
}

export function checkSunk(ship: Ship): boolean {
    return ship.cells.every(n => n.isHit); //check every index of list on condition
}

export function checkGameOver(board: Board):boolean {
    return board.ships.every(n => n.isSunk);
}

