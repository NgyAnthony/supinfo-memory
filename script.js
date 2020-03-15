class UIManager {
    constructor(defaultFaceDownStyleID, defaultDifficultyOption) {
        this.faceDownStyleID = defaultFaceDownStyleID;
        this.difficultyOption = defaultDifficultyOption;
        this.cardsFound = [];
        this.numberOfMoves = 0;
        this.timer = 0;
        this.hideGameInfo()
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

    getDifficultyOption() {
        return this.difficultyOption
    }

    getFaceDownStyleID() {
        return this.faceDownStyleID
    }

    createCardsHTML(gameBoard) {
        // Show the cards found
        for (const cardFound of this.cardsFound) {
            var cardFoundImage = document.createElement("IMG");
            cardFoundImage.src = 'assets/' + cardFound;
            document.getElementById('cardsFound').appendChild(cardFoundImage)
        }

        // Iterate over each of the card in the gameBoard array
        for (const card of gameBoard) {
            // Create button that encapsulates image
            var newCardButton = document.createElement("BUTTON");
            // Set the ID of this button equal to the uniqueID of the card object
            newCardButton.id = card.uniqueID;

            // Image stored in button
            var newCardImage = document.createElement("IMG");
            // Set the ID of this image equal to the uniqueID of the card object + the 'image' string
            newCardImage.id = card.uniqueID + 'image';

            // Add image to the button
            newCardButton.appendChild(newCardImage);
            // Add button to the document
            let gameDiv = document.getElementById('game');
            if (this.difficultyOption === '2/3') {
                gameDiv.className = 'difficulty1';
            } else if (this.difficultyOption === '3/6') {
                gameDiv.className = 'difficulty2';
            } else if (this.difficultyOption === '3/12' || this.difficultyOption === 'hardcore') {
                gameDiv.className = 'difficulty3';
            }
            gameDiv.appendChild(newCardButton);
            console.log(gameDiv)
        }
    }

    removeCardsHTML() {
        document.getElementById('game').innerHTML = "";
        document.getElementById('cardsFound').innerHTML = ""
    }

    showCardDownOrUp(gameBoard) {
        document.getElementById('verif').innerText = this.numberOfMoves;
        // Iterate over each of the card in the gameBoard array
        for (const card of gameBoard) {
            // Get the button of the card which has a uniqueID ID
            let buttonCard = document.getElementById(card.uniqueID);
            // Get the image reference as well
            let imageCard = document.getElementById(card.uniqueID + 'image');

            // If the status of the card is to be faced down
            if (card.cardIsFacedDown) {
                // Show the card faced down
                imageCard.src = 'assets/'+ card.faceDownImage;
            } else if (!card.cardIsFacedDown) {
                // Otherwise show the card faced up
                imageCard.src = 'assets/'+ card.cardImage;
            }
        }
    }

    showGameInfo() {
        const divInfo = document.getElementById("info");
        divInfo.style.display = "block";
    }

    hideGameInfo() {
        const divInfo = document.getElementById("info");
        divInfo.style.display = "none";
    }

    hideMenu() {
        const divMenu = document.getElementById("menu");
        divMenu.style.display = "none";
    }
}

class CardObject {
    constructor(faceDownStyleID, cardID) {
        this.faceDownStyleID = faceDownStyleID;
        this.faceDownImage = 'faceDown' + faceDownStyleID + '.png';
        this.cardID = cardID;
        this.cardImage = cardID + '.png';
        this.cardIsFacedDown = true;
    }

    createUniqueID(id) {
        this.uniqueID = id;
    }
}


class GameManager {
    constructor(UIManagerRef) {
        // Keep the reference of the UIManager instance
        this.UIManager = UIManagerRef;
        // Contains objects of CardObject class.
        this.gameBoard = [];
        // Contains at most two CardObject instances
        this.pairSelected = [];
        this.numberOfPairsToCall = 0;
        this.reshuffleOption = false;
    }

    resetEverything() {
        this.gameBoard = [];
        this.pairSelected = [];
        this.numberOfPairsToCall = 0;
        this.reshuffleOption = false;
        this.UIManager.removeCardsHTML();
        this.UIManager.cardsFound = [];
        this.UIManager.numberOfMoves = 0;
        this.UIManager.timer = 0;
    }

    startGame() {
        this.UIManager.showGameInfo();
        this.UIManager.hideMenu();
        this.resetEverything();
        // Define the number of pairs to call based on the difficulty chosen
        this.defineNumberOfPairsToCall();
        // Create objects of the CardObject class based on the number of pairs to call
        this.instantiateCards();
        // Define whether the GameManager must reshuffle the gameBoard or not.
        this.defineIfReshuflle();
        // Shuffle the gameBoard once.
        this.shuffleGameBoard();

        // Create the HTML elements for each card based on the gameBoard
        this.UIManager.createCardsHTML(this.gameBoard);
        // Ask to refresh face down or up status (all cards are face down here)
        this.UIManager.showCardDownOrUp(this.gameBoard);
        // Add a document listener on each card
        this.addOnClickHandler();
    }

    defineNumberOfPairsToCall() {
        if (this.UIManager.getDifficultyOption() === '2/3') {
            this.numberOfPairsToCall = 3;
        } else if (this.UIManager.getDifficultyOption() === '3/6') {
            this.numberOfPairsToCall = 9;
        } else if (this.UIManager.getDifficultyOption() === '3/12' || 'hardcore') {
            this.numberOfPairsToCall = 18;
        }
    }

    instantiateCards() {
        for (let cardIDIncrementer = 0; cardIDIncrementer < this.numberOfPairsToCall; cardIDIncrementer++) {
            this.gameBoard.push(new CardObject(this.UIManager.getFaceDownStyleID(), cardIDIncrementer));
            this.gameBoard.push(new CardObject(this.UIManager.getFaceDownStyleID(), cardIDIncrementer))
        }

        for (let uniqueID = 0; uniqueID < this.numberOfPairsToCall * 2; uniqueID++) {
            this.gameBoard[uniqueID].createUniqueID(uniqueID)
        }
    }

    defineIfReshuflle() {
        this.reshuffleOption = this.UIManager.getDifficultyOption() === 'hardcore';
    }

    shuffleGameBoard() {
        this.gameBoard.sort(() => Math.random() - 0.5);
    }

    addOnClickHandler() {
        // For each card in the gameBoard array
        for (const card of this.gameBoard) {
            // Add a document listener of click event to each button
            document.getElementById(card.uniqueID).addEventListener("click", () => this.handleClick(card));
        }
    }

    handleClick(card) {
        this.UIManager.incrementNumberOfMoves();
        // If the card is faced down and the length of the selected pair is inferior to two
        if (card.cardIsFacedDown && this.pairSelected.length < 2) {
            // Set the card face down status to false
            card.cardIsFacedDown = false;
            // Add the selected card to the pairSelected array
            this.pairSelected.push(card);
            // Tell the UIManager to show the card faced up
            this.UIManager.showCardDownOrUp(this.gameBoard);
            if (this.pairSelected.length === 2){
                // Check if the pairSelected array has two elements with identical cardID
                this.checkIfPair()
            }
        }
    }

    removeCards(ID) {
        this.gameBoard = this.gameBoard.filter(card => card.cardID !== ID)
    }

    // This function removes all cards in the HTML and re-creates them based on the gameBoard.
    reInitializeHTML() {
        this.UIManager.removeCardsHTML();
        this.UIManager.createCardsHTML(this.gameBoard);
        this.UIManager.showCardDownOrUp(this.gameBoard);
        this.addOnClickHandler();
    }

    // Checks if two cards have the same cardID
    checkIfPair() {
        let cardOne = this.pairSelected[0];
        let cardTwo = this.pairSelected[1];

        // If the two cards have the same cardID, the player found a pair
        if (cardOne.cardID === cardTwo.cardID) {
            // Push the found pair into the cards found list
            this.UIManager.updateCardsFound(cardOne.cardImage);
            // Remove the cards from the gameBoard array
            this.removeCards(cardOne.cardID);
            // Wait before refreshing the HTML
            setTimeout(() => this.reInitializeHTML(), 1000);
        } else {
            // Set the cards status back to face down
            cardOne.cardIsFacedDown = true;
            cardTwo.cardIsFacedDown = true;
            // If the mode is hardcore
            if (this.UIManager.difficultyOption === 'hardcore') {
                // Re-shuffle the board
                this.shuffleGameBoard();
                // Reset the HTML
                this.reInitializeHTML()
            } else {
                // Wait before refreshing the HTML
                setTimeout(() => this.UIManager.showCardDownOrUp(this.gameBoard), 1000);
            }
        }
        // Reset the pairSelected array.
        this.pairSelected = [];
    }
}

UIManagerInstance = new UIManager('0', '2/3');
gameManagerInstance = new GameManager(UIManagerInstance);

