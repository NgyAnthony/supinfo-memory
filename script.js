class CardObject {
    constructor(faceDownStyleID, cardID) {
        this.faceDownStyleID = faceDownStyleID;
        this.faceDownImage = 'faceDown' + faceDownStyleID + '.png';
        this.cardID = cardID;
        this.cardImage = cardID + '.png';
        this.cardIsFacedDown = true;
    }

    setCardDown() {
        this.cardIsFacedDown = true;
    }

    setCardUp() {
        this.cardIsFacedDown = false;
    }
}

class UIManager {
    constructor(defaultFaceDownStyleID, defaultDifficultyOption) {
        this.faceDownStyleID = defaultFaceDownStyleID;
        this.difficultyOption = defaultDifficultyOption;
        this.cardsFound = [];
        this.numberOfMoves = 0;
        this.timer = 0;
    }

    changeFaceDownStyleID(chosenFaceDownStyle) {
        this.faceDownStyleID = chosenFaceDownStyle
    }

    changeDifficultyOption(chosenDifficulty) {
        this.difficultyOption = chosenDifficulty
    }

    updateCardsFound(cardFound) {
        this.cardsFound.push(cardFound)
    }

    incrementNumberOfMoves() {
        this.numberOfMoves++
    }
}

class GameManager {
    constructor(UIManagerRef) {
        this.UIManager = UIManagerRef;
        this.gameBoard = []
    }

    instantiateCard() {
    }
}

uimanagerInstance = new UIManager('0', '2/3');
gamemanagerInstance = new GameManager(uimanagerInstance);
