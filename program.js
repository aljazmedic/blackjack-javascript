//
//  Blackjack
//  by David Bešter, Aljaž Medič :P
//

// Card Variables
let suitsWords = ["Hearts","Diamonds","Clubs","Spades"];
let suits = ["\u2665","\u2666","\u2663","\u2660"];
let values = ["Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Jack","Queen","King"];

let textArea = document.getElementById("text-area");

// Global game Variables
let gameStarted = false;
let playerStay;
let dealerHand;
let playerHand;
let deck;

function setup() {
    playerStay = false;

	playerHand = new Hand();
	dealerHand = new Hand();

	deck = createDeck(1);
	shuffleDeck(deck);
	dealerHand.add(2);
	playerHand.add(2);
	dealerHand.switchVisibility(0, 1);

	createCanvas(600, 600);

	hitButton = createButton("Hit!")
	hitButton.mousePressed(function(){
		playerHand.add(1);
	});

	stayButton = createButton("Stay!")
	stayButton.mousePressed(function(){
		dealerHand.switchVisibility(0, 1);
		playerStay = true;
	});

    if(playerHand.canSplit()){
    	splitButton = createButton("Split!")
		splitButton.mousePressed(function(){
		    playerHand.split();
		    splitButton.remove();
		});
    }
}

function draw() {
	checkForEndOfGame();
	render();
}

function render(){
	background(68, 201, 48);

	drawCards(width/2, 150, dealerHand.cards);
	drawCards(width/2, height-150, playerHand.cards);

	fill(0);
	stroke(0);

	text(trim(dealerHand.guiScore), width/2, 50);
	text(trim(playerHand.guiScore), width/2, height-50);
}



function drawCards(posx, posy, cards){
	let space = 4;
	let cardw = 50;
	
	let dY = cardw*1.56+space*2;
	let dX = space+cardw;

	for (var j = 0; j < cards.length; j++) {
		cardPack = cards[j];

		let len = cardPack.length;
		let startX = posx - ((len*cardw + (len-1)*space))/2

		for(let i = 0; i < cardPack.length; i++){
			let card = cardPack[i];
			fill(255);
			stroke(0);
			rectMode(CENTER);
			rect(startX + i*dX, posy - dY*j, cardw, cardw*1.56, 6);
			if(card[2]){
				textAlign(CENTER);
				textSize(cardw/2.5);
				if(card[1] < 2){
					fill(239, 11, 11);
					stroke(239, 11, 11);
				}
				else{
					fill(0);
					stroke(0);
				}
				text(getCardString(card), startX+i*dX, posy-dY*j)
			}else{
				fill(102, 64, 35);
				stroke(0);
				rect(startX + i*dX, posy - dY*j, cardw*0.9, cardw*1.56*0.9, 6*0.9)
			}
		}
	}
	
}


function drawWinner(winnerName){
	background(68, 201, 48);
	textAlign(CENTER);
	textSize(64);
	stroke(0);
	fill(0);
	text(winnerName, width/2, height/2)
}