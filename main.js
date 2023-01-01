(() => {
    const PLAYERS = {
        USER: 'user',
        COMPUTER: 'computer',
    };
    const OPTIONS = {
        X: String.fromCharCode(0x2715),
        O: String.fromCharCode(0x25EF),
    };
    const MESSAGES = {
        WON: 'You have won the game!',
        LOST: 'Sorry! You have lost the game. Try again!',
        TIE: 'This game is a tie!',
        EMPTY: '',
    };

    let currentPlayer = PLAYERS.USER;
    const playerOptionMap = {
        [PLAYERS.USER]: OPTIONS.X,
        [PLAYERS.COMPUTER]: OPTIONS.O,
    };
    let optionPlayerMap = Object.keys(playerOptionMap).reduce(
        (optionMap, player) => ({ ...optionMap, [playerOptionMap[player]]: player }),
        {},
    );

    const gameActionsSelect = document.getElementById('game-actions-select');
    const gameActionsReset = document.getElementById('game-actions-reset');
    const gameGrid = document.getElementById('game-grid');
    const gameMessage = document.getElementById('game-message');

    const gameActionsOptions = gameActionsSelect.querySelectorAll('option');
    const gameGridItems = gameGrid.querySelectorAll('button');

    function getGridValues() {
        const gridValues = Array.from(Array(3), () => []);
        gameGridItems?.forEach((gridItem, index) => {
            const rowIndex = Math.floor(index / 3);
            const columnIndex = index % 3;

            gridValues[rowIndex][columnIndex] = gridItem?.textContent;
        });

        return gridValues;
    }

    function isItemsEqual(items) {
        return items?.every(item => !!item && item === items[0]) ?? false;
    }

    function setGameMessage(message) {
        if (!gameMessage) {
            return;
        }

        gameMessage.textContent = message;
        gameMessage.style.display = message === MESSAGES.EMPTY ? 'none' : 'flex';
    }

    function isGridItemEmpty(gridElement) {
        return !!gridElement && !gridElement.textContent;
    }

    function checkGridForSuccess() {
        if (gameMessage?.textContent !== MESSAGES.EMPTY) {
            return;
        }

        const gridValues = getGridValues();
        const leftDiagonal = [];
        const rightDiagonal = [];
        let player = null;
        let isFull = true;
        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            leftDiagonal.push(gridValues[rowIndex][rowIndex]);
            rightDiagonal.push(gridValues[rowIndex][2 - rowIndex]);

            const row = [];
            const column = [];
            for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
                row.push(gridValues[rowIndex][columnIndex]);
                column.push(gridValues[columnIndex][rowIndex]);

                if (!gridValues[rowIndex][columnIndex]) {
                    isFull = false;
                }
            }

            if (isItemsEqual(row)) {
                player = optionPlayerMap[row[0]];
                break;
            } else if (isItemsEqual(column)) {
                player = optionPlayerMap[column[0]];
                break;
            }
        }

        if (!player && isItemsEqual(leftDiagonal)) {
            player = optionPlayerMap[leftDiagonal[0]];
        } else if (!player && isItemsEqual(rightDiagonal)) {
            player = optionPlayerMap[rightDiagonal[0]];
        }

        const newMessage = (
            player === PLAYERS.USER
            ? MESSAGES.WON
            : (
                player === PLAYERS.COMPUTER
                ? MESSAGES.LOST
                : (isFull ? MESSAGES.TIE : MESSAGES.EMPTY)
            )
        );
        setGameMessage(newMessage);
    }

    function gameGridClick(gridElement, player) {
        if (!isGridItemEmpty(gridElement)) {
            return;
        }

        gridElement.textContent = playerOptionMap[player];
        checkGridForSuccess();

        if (gameMessage.textContent !== MESSAGES.EMPTY) {
            return;
        }

        if (player === PLAYERS.USER) {
            computerGameGridClick();
        }
    }

    function computerGameGridClick() {
        const emptyGridItems = Array.from(gameGridItems).filter(isGridItemEmpty);
        const randomGridItem = emptyGridItems[Math.floor(Math.random() * emptyGridItems.length)];
        gameGridClick(randomGridItem, PLAYERS.COMPUTER);
    }

    function resetGrid() {
        gameGridItems?.forEach(gameGridItem => gameGridItem.textContent = '');
        setGameMessage(MESSAGES.EMPTY);
        currentPlayer = currentPlayer === PLAYERS.USER ? PLAYERS.COMPUTER : PLAYERS.USER;

        if (currentPlayer === PLAYERS.COMPUTER) {
            computerGameGridClick();
        }
    }

    function changeUserOption($event) {
        const newValue = $event?.target?.value;
        if (newValue === playerOptionMap[PLAYERS.USER]) {
            return;
        }

        playerOptionMap[PLAYERS.USER] = newValue;
        playerOptionMap[PLAYERS.COMPUTER] = newValue === OPTIONS.X ? OPTIONS.O : OPTIONS.X;
        optionPlayerMap = Object.keys(playerOptionMap).reduce(
            (optionMap, player) => ({ ...optionMap, [playerOptionMap[player]]: player }),
            {},
        );

        resetGrid();
    }

    gameActionsReset.addEventListener('click', resetGrid);
    gameGridItems?.forEach(gameGridItem => gameGridItem?.addEventListener('click', ($event) => gameGridClick($event.target, PLAYERS.USER)));

    const options = Object.values(OPTIONS);
    gameActionsOptions?.forEach((gameActionsOption, index) => {
        gameActionsOption.textContent = options[index];
        gameActionsOption.value = options[index];
    });

    gameActionsSelect?.addEventListener('change', changeUserOption);
})();
