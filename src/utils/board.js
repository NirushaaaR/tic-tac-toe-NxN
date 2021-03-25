export const checkWinner = (size, board) => {
    let zeroExists = false;

    const checkArray = [];

    // horizontal & vertical & Diagonal
    const diagonalLeft = [];
    const diagonalRight = [];
    for (let i = 0; i < size; i++) {
        const horizontal = [];
        const vertical = [];
        diagonalLeft.push([i, i])
        diagonalRight.push([i, size - i - 1]);

        for (let j = 0; j < size; j++) {
            horizontal.push([i, j]);
            vertical.push([j, i]);
            zeroExists = zeroExists || board[i][j] === 0;
        }
        checkArray.push(horizontal);
        checkArray.push(vertical);
    }

    checkArray.push(diagonalLeft);
    checkArray.push(diagonalRight);

    // check if player win
    const playerWin = checkArray.filter((check) => check.every(([i, j]) => board[i][j] === 1));
    if (playerWin.length > 0) {
        return [1, playerWin[0]];
    }

    // check if bot win
    const botWin = checkArray.filter((check) => check.every(([i, j]) => board[i][j] === -1));
    if (botWin.length > 0) {
        return [-1, botWin[0]];
    }

    // draw
    if (!zeroExists) {
        return [0, []];
    }

    return null;
}

export const generateBoard = (size) => {

    const board = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push(0)
        }
        board.push(row);
    }

    return board;
}