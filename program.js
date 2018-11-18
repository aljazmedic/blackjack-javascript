//
//  Blackjack
//  by David Bešter, Aljaž Medič :P
//

// Card Variables
let suitsWords = ["Hearts","Clubs","Diamonds","Spades"];
let suits = ["\u2665","\u2663","\u2666","\u2660"];
let values = ["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Jack","Queen","King"];

let textArea = document.getElementById("text-area");

// Global game Variables
let gameOver;
let gameStarted = false;
let playerStay;
let playerWon;
let dealerHand;
let playerHand;
let deck;

function setup() {
	gameOver = false;
	playerWon = false;
    playerStay = false;

	playerHand = new Hand();
	dealerHand = new Hand();

	deck = createDeck(1);
	shuffleDeck(deck);
	dealerHand.add(2);
	playerHand.add(2);

	//newGameButton = createCanvas("New game");
	//newGameButton.mousePressed()

	createCanvas(600, 600);

	hitButton = createButton("Hit!")
	hitButton.mousePressed(function(){
		playerHand.add(1);
		checkForEndOfGame();
		showStatus();
	});

	stayButton = createButton("Stay!")
	stayButton.mousePressed(function(){
		playerStay = true;
		checkForEndOfGame();
		showStatus();
	});

    if(playerHand.canSplit()){
    	splitButton = createButton("Split!")
		splitButton.mousePressed(function(){
		    playerHand.split();
		});
    }
}

function draw() {
	background(68, 201, 48);
	drawCards(120, 120, dealerHand.cards[0][0]);
}

function drawCards(posx, posy, cards){
	len = cards.length;

	fill(255)
	rectMode(CENTER)
	rect(posx, posy, 55, 55, 6)
	rectMode(RIGHT)
	textSize(20)
	fill(0);
	stroke(0);
	text(getCardString(cards), posx, posy)
}