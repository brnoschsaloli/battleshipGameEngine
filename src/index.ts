import * as readline from "readline";
import { createPlayer } from "./factory.js";
import { fireShot, checkGameOver, placeShip } from "./game.js";
import { randomPlaceShip, randomFireShot, smartFireShot } from "./ai.js";
import { parseInput, printBoard } from "./utils.js";
import type { Player } from "./types.js"

const rl = readline.createInterface({
    input: process.stdin, // read from termial input
    output: process.stdout // write to terminal output
});

function askQuestion(question: string): Promise<string> {
    return new Promise(resolve => rl.question(question, resolve));
}


// Define the fleet - every game has these 5 ships
const FLEET = [
    { name: "Carrier",    size: 5 },
    { name: "Battleship", size: 4 },
    { name: "Cruiser",    size: 3 },
    { name: "Submarine",  size: 3 },
    { name: "Destroyer",  size: 2 },
];

async function placePlayerShips(player: Player): Promise<void> {
    for (const shipDef of FLEET) {
        const ship = { name: shipDef.name, size: shipDef.size, cells: [], isSunk: false };
        
        while (true) {
            // print player's board so they can see current placements
            printBoard(player.board, false);
            
            // ask for position and orientation
            const input = await askQuestion(`Choose where to place ship ${ship.name}: (A0 - J9) `);
            // parse input
            const parsed = parseInput(input);
            if (parsed == null){
                console.log("Placement error");
                continue
            }
            // ask for orientation: "H" or "V"
            const input2 = await askQuestion(`Choose the orientation for ${ship.name}: (H / V) `);
            const upper = input2.trim().toUpperCase();
            if (upper != "H" && upper != "V") {
                console.log("Orientation error");
                continue
            }
            
            const orientation = upper === "H" ? "horizontal" : "vertical";
            if (placeShip(player.board, ship, parsed[0], parsed[1], orientation)) break;

            console.log("Overbounds or overlapping error");
            continue
        }
    }
}

async function main() {
    // 1. Create players
    const player = createPlayer("Player");
    const computer = createPlayer("Computer");

    // 2. Place computer ships randomly
    for (const shipDef of FLEET) {
        const ship = { name: shipDef.name, size: shipDef.size, cells: [], isSunk: false };
        randomPlaceShip(computer.board, ship);
    }

    // 3. Place player ships randomly too (for now)
    await placePlayerShips(player);

    
    // 4. Game loop
    let winner = ""
    while (true) {
        console.log("Own Board:");
        printBoard(player.board, false);
        console.log("Opp Board:");
        printBoard(player.trackingBoard, true);
        
        while (true) {
            const input = await askQuestion("Fire at (A0 - J9): ");
            const parsed = parseInput(input);
            if (parsed) {
                const trackingCell = player.trackingBoard.grid[parsed[0]]![parsed[1]]!;
                if (trackingCell.isHit) {
                    console.log("Already fired there!");
                    continue; //skip to next iteration of loop
                }

                const sunkBefore = new Set(computer.board.ships.filter(s => s.isSunk).map(s => s.name)); //map the ship array into a name array
                const hit = fireShot(computer.board, parsed[0], parsed[1]);

                if (hit) {
                    const newlySunk = computer.board.ships.find(s => s.isSunk && !sunkBefore.has(s.name));
                    if (newlySunk) console.log(`You sunk the ${newlySunk.name}!`); //python f""
                }

                trackingCell.isHit = hit;
                const hadShip = computer.board.grid[parsed[0]]![parsed[1]]!.hasShip;
                trackingCell.hasShip = hadShip
                if (hadShip) console.log("Hit!"); else console.log("Miss!");
                break;
            }
        }


        
        if (checkGameOver(computer.board)){
            winner = "Player";
            break;
        }
        
        console.log("Computer turn:")
        const sunkBefore = new Set(player.board.ships.filter(s => s.isSunk).map(s => s.name));
        if (smartFireShot(player.board)) {
            console.log("Hit!");
            const newlySunk = player.board.ships.find(s => s.isSunk && !sunkBefore.has(s.name));
            if (newlySunk) console.log(`Computer sunk the ${newlySunk.name}!`);
        } else {
            console.log("Miss!");
        }
        if (checkGameOver(player.board)){
            winner = "Computer";
            break;
        }
        console.log("------------------------")
    }

    rl.close();
    // TODO: print who won
    console.log(winner + " is the winner!");
    
}

main();