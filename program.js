//
//  Blackjack
//  by David Bešter
//

// Card Variables
let suitsWords = ["Hearts","Clubs","Diamonds","Spades"];
let suits = ["\u2665","\u2663","\u2666","\u2660"];
let values = ["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Jack","Queen","King"];

// DOM Variables
let textArea = document.getElementById("text-area");
let newGameButton = document.getElementById("new-game-button");
let hitButton = document.getElementById("hit-button");
let stayButton = document.getElementById("stay-button");
let splitButton = document.getElementById("split-button");

// Global game Variables
let gameStarted;
let gameOver;
let playerStay;
let playerWon;
let dealerHand;
let playerHand;
let deck;

hitButton.style.display = "none";
stayButton.style.display = "none";
splitButton.style.display = "none";
showStatus();

newGameButton.addEventListener('click', function(){
	gameStarted = true;
	gameOver = false;
	playerWon = false;
    playerStay = false;

	playerHand = new Hand();
	dealerHand = new Hand();

	deck = createDeck(1);
	shuffleDeck(deck);
	dealerHand.add(2);
	playerHand.add(2);

	newGameButton.style.display = 'none';
	hitButton.style.display = 'inline';
	stayButton.style.display = 'inline';
    if(playerHand.canSplit()){
        splitButton.style.display = 'inline'
    }
	showStatus();

});

hitButton.addEventListener('click', function(){
	playerHand.add(1);
	checkForEndOfGame();
	showStatus();
});

stayButton.addEventListener('click', function(){
	playerStay = true;
	checkForEndOfGame();
	showStatus();
});

splitButton.addEventListener('click', function(){
    playerHand.split();
});

function createDeck(numberOfDecks) {
	let deck = [];
	for (let i = 0; i < numberOfDecks; i++) {
		for (let suitsIdx = 0; suitsIdx < suits.length; suitsIdx++) {
			for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
				//creating tuples of numbers to use less space
				let card = [valueIdx, suitsIdx]; 
				deck.push(card);
			}
		}
	}
	return deck;
}

function shuffleDeck(deck) {
	for (let i = deck.length-1; i >=0 ; i--) {

		let swapIdx = Math.trunc(Math.random() * i);

		let tmp = deck[swapIdx];
		deck[swapIdx] = deck[i];
		deck[i] = tmp;
	}
}

/*function getCardString(card) {
	//translating tuple to words using arrays
	return  values[card[0]]+ ' of ' + suitsWords[card[1]] + '\n'
}*/

function getCardString(card) {
	let ret = "|"
	//king, ace, queen, jack
	if([0,10,11,12].includes(card[0])){ 
		ret+=values[card[0]].charAt(0);
	}else{
		ret+=""+(card[0]+1)
	}
	return ret+ " "+ suits[card[1]] + '|'
}

function getCards(num){
	ret = [];
	for (let i = 0; i < num; i++) {
		ret.push(deck.pop())
	}
	return ret;
}

function checkForEndOfGame() {
    if(playerStay){
        while(dealerHand.scores[0] <= 17){
            dealerHand.add(getCard(1));
        }
    }

	for (let pack = 0; pack < playerHand.cards.length; pack++) {
		if (playerHand.scores[pack] > 21) {
			playerWon = false;
			gameOver = true;
		}
		else if (dealerHand.scores[0] > 21) {
			playerWon = true;
			gameOver = true;
		}

		if (!gameOver) {
			if (playerHand.scores[pack] > dealerHand.scores[0]) {
				playerWon = true;
			}
		}
	}
	
	showStatus();
}

function showStatus() {
	if (!gameStarted) {
		textArea.innerText = 'Welcome to Blackjack!';
		return; 
	}

	let dealerString = dealerHand.log();
	let playerString = playerHand.log();

	textArea.innerText =
		'Dealer has: \n' +
		dealerString +

		'Player has: \n' +
		playerString;

		if (gameOver) {
			if (playerWon) {
				textArea.innerText += "YOU WIN!";
			}
			else {
				textArea.innerText += "DEALER WINS";
			}
			newGameButton.style.display = 'inline';
			hitButton.style.display = 'none';
			stayButton.style.display = 'none';
            splitButton.style.display = 'none';
		}
};

function getCardValue(card) {
	if(card[0] >= 9){
		return 10;
	}else{
		return (card[0]+1);
	}
}

function Hand(){
	this.cards = [[]];
	this.scores = [0];

	this.add = function(numOfCardsToAdd){
		for(let i = 0; i < this.cards.length;i++){
			this.cards[i] = this.cards[i].concat(getCards(numOfCardsToAdd));
			console.log(this.cards)
		}
		this.evaluate();
	}

	this.evaluate = function(){
		for (let pack = 0; pack < this.cards.length; pack++) {
			let hasAce = false;
			this.scores[pack] = 0;
			for (let card of this.cards[pack]){
				this.scores[pack]+=getCardValue(card);
				if(card[0] == 0){
					hasAce = true;
				}
			}
			if (hasAce && (this.scores[pack] + 10 <= 21)){
				this.scores[pack] += 10;
			}

            if(this.scores[pack] > 21){
                playerWon = false;
                gameOver = true;
                checkForEndOfGame();
            }
		}
	}

	this.log = function(){
		let ret;

		for (let pack = 0; pack < this.cards.length; pack++) {
			if(this.cards.length == 1){ //samo en kupcek kart
				ret = "";
			}else{
				ret = (pack+1) + ". Hand\n"
			}

			for (let i = 0; i < this.cards[pack].length; i++) {
				ret += getCardString(this.cards[pack][i]);
			}

			ret += "\n";
			ret += '(score: ' + this.scores[pack] + ')\n\n';
		}
		return ret;
	}

    this.canSplit = function(){
        if(this.cards.length == 1 && this.cards[0][0][0] == this.cards[0][1][0]){ //prvi kupcek, prva karta, vrednost
            return true;
        }
        return false;
    }

    this.split = function(){
        this.cards.push([this.cards[0].pop()]);
        this.scores.push(0);
    }
}