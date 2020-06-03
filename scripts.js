var gameBoard = {
  numberOfRows: 10,
  numberOfColumns: 10,
  createGrid() {
      for (var i = 0; i < this.numberOfRows; i++) {
          for (var j = 0; j < this.numberOfColumns; j++) {
              $('#gameBoard').append(`<div class="grid_item" data-cell="${i}${j}"></div>`);
          }
      }
  }
};
var helpingFunctionsPlace = {
  randomNumber(number) {
      return Math.floor(Math.random() * number);
  },
  selectRandomCell() {
     var randomCell = "";
     var r = this.randomNumber(10);
     var c = this.randomNumber(10);
     let randomCellRow = r.toString();
     let randomCellColumn = c.toString();
     randomCell = randomCellRow + randomCellColumn;
     return randomCell;
 },
 checkAvailability(cell) {
     var isThereWeaponSword = $(`[data-cell=${cell}]`).hasClass('weaponsword');
     var isTherePlayer1 = $(`[data-cell=${cell}]`).hasClass('player1');
     var isThereAnObstacle = $(`[data-cell=${cell}]`).hasClass('obstacle');
     var isTherePlayer2 = $(`[data-cell=${cell}]`).hasClass('player2');
     var isThereWeapongun = $(`[data-cell=${cell}]`).hasClass('weapongun');
     var isThereWeaponpike = $(`[data-cell=${cell}]`).hasClass('weaponpike');
     var isThereWeaponMace = $(`[data-cell=${cell}]`).hasClass('weaponmace');
     if ((isThereAnObstacle || isTherePlayer1 || isTherePlayer2 || isThereWeaponSword || isThereWeapongun || isThereWeaponpike || isThereWeaponMace)) {
         return true;
     }
     return false;
 },
 placeItem(item) {
    var randomCell = this.selectRandomCell();
    var isnotAvailable = this.checkAvailability(randomCell);
    if (isnotAvailable) {
        return this.placeItem(item);
    } else $(`[data-cell=${randomCell}]`).addClass(`${item}`);
 },
 checkTouch(randomCellP1, randomCellP2) {
     var decimalNumberp1 = parseInt(randomCellP1.charAt(0));
     var decimalNumberp2 = parseInt(randomCellP2.charAt(0));
     var numberp1 = parseInt(randomCellP1.charAt(1));
     var numberp2 = parseInt(randomCellP2.charAt(1));
     var touch = false;
     if (decimalNumberp2 === decimalNumberp1) {
         if ((numberp1 === numberp2 + 1) || (numberp1 === numberp2 - 1)) {
             touch = true;
         }
     } else if (numberp1 === numberp2) {
         if ((decimalNumberp1 === decimalNumberp2 + 1) || (decimalNumberp1 === decimalNumberp2 - 1)) {
             touch = true;
         }
     }
     return touch;
 },
   showDamageAndLifePoints(){
     $("#damagep1").text(player1.weapon.damage);
     $("#damagep2").text(player2.weapon.damage);
     $("#lifePointsp1").text(player1.lifePoints);
     $("#lifePointsp2").text(player2.lifePoints);
   }
};
var helpingFunctionsMove = {
  playerRange(playerCell) {
      var negativeHRange = 3;
      var positiveHRange = 3;
      var negativeVRange = 3;
      var positiveVRange = 3;
      var decimalNumber = parseInt(playerCell.charAt(0));
      var number = parseInt(playerCell.charAt(1));
      for (var i = 1; i < 4; i++) {
          var testNumber = number - i;
          var testCell = decimalNumber.toString() + testNumber.toString();
          if ($(`[data-cell=${testCell}]`).hasClass('obstacle')) {
              negativeHRange = i - 1;
              break;
          }
      }
      for (var i = 1; i < 4; i++) {
          var testNumber = number + i;
          var testCell = decimalNumber.toString() + testNumber.toString();
          if ($(`[data-cell=${testCell}]`).hasClass('obstacle')) {
              positiveHRange = i - 1;
              break;
          }
      }
      for (var i = 1; i < 4; i++) {
          var testdecimal = decimalNumber - i;
          var testCell = testdecimal.toString() + number.toString();
          if ($(`[data-cell=${testCell}]`).hasClass('obstacle')) {
              negativeVRange = i - 1;
              break;
          }
      }
      for (var i = 1; i < 4; i++) {
          var testdecimal = decimalNumber + i;
          var testCell = testdecimal.toString() + number.toString();
          if ($(`[data-cell=${testCell}]`).hasClass('obstacle')) {
              positiveVRange = i - 1;
              break;
          }
      }
      var range = [negativeHRange, positiveHRange, negativeVRange, positiveVRange];
      return range;
  },
  //i can highlight the range addClass("range") to the cells in range and add event listener .click to these cells
  inRange(selectedCell, playerCell, range) {
      var decimalNumberSelectedCell = parseInt(selectedCell.charAt(0));
      var decimalNumberPlayerCell = parseInt(playerCell.charAt(0));
      var numberCell1 = parseInt(selectedCell.charAt(1));
      var numberCell2 = parseInt(playerCell.charAt(1));
      var differenceDecimal = decimalNumberSelectedCell - decimalNumberPlayerCell;
      var differenceNumber = numberCell1 - numberCell2;
      var negativeHRange = range[0];
      var positiveHRange = range[1];
      var negativeVRange = range[2];
      var positiveVRange = range[3];
      if (decimalNumberPlayerCell === decimalNumberSelectedCell) {
          if (differenceNumber < 0 && Math.abs(differenceNumber) <= negativeHRange) {
              return true;
          } else if (differenceNumber > 0 && Math.abs(differenceNumber) <= positiveHRange) {
              return true;
          }
      } else if (numberCell1 === numberCell2) {
          if (differenceDecimal < 0 && Math.abs(differenceDecimal) <= negativeVRange) {
              return true;
          } else if (differenceDecimal > 0 && Math.abs(differenceDecimal) <= positiveVRange) {
              return true;
          }
      }
  },
  switchPlayers() {
      if (activePlayer === player1) {
          activePlayer = player2;
          passivePlayer = player1;
      } else {
          activePlayer = player1;
          passivePlayer = player2;
      }
  },
  changeWeapons(selectedCellNumber, selectedCell) {
      if ($(`[data-cell=${selectedCellNumber}]`).hasClass('weapongun')) {
          $(selectedCell).addClass(`${activePlayer.weapon.name}`);
          $(selectedCell).removeClass('weapongun');
          activePlayer.weapon = gun;
      } else if ($(`[data-cell=${selectedCellNumber}]`).hasClass('weaponpike')) {
          $(selectedCell).addClass(`${activePlayer.weapon.name}`);
          $(selectedCell).removeClass('weaponpike');
          activePlayer.weapon = pike;
      } else if ($(`[data-cell=${selectedCellNumber}]`).hasClass('weaponmace')) {
          $(selectedCell).addClass(`${activePlayer.weapon.name}`);
          $(selectedCell).removeClass('weaponmace');
          activePlayer.weapon = mace;
      } else if ($(`[data-cell=${selectedCellNumber}]`).hasClass('weaponsword')) {
          $(selectedCell).removeClass('weaponsword');
          $(selectedCell).addClass(`${activePlayer.weapon.name}`);
          activePlayer.weapon = sword;
      } else if ($(`[data-cell=${selectedCellNumber}]`).hasClass('weapondagger')) {
          $(selectedCell).addClass(`${activePlayer.weapon.name}`);
          $(selectedCell).removeClass('weapondagger');
          activePlayer.weapon = dagger;
      }
  }
};
var helpingFunctionsFight = {
  enableFightButtons() {
     if (activePlayer === player1) {
         document.getElementById("P1Attack").disabled = false;
         document.getElementById("P1Defend").disabled = false;
     } else {
         document.getElementById("P2Attack").disabled = false;
         document.getElementById("P2Defend").disabled = false;
     }
 },
 disableFightButtons() {
    if (activePlayer === player1) {
        document.getElementById("P1Attack").disabled = true;
        document.getElementById("P1Defend").disabled = true;
    } else {
        document.getElementById("P2Attack").disabled = true;
        document.getElementById("P2Defend").disabled = true;
    }
},
defend() {
    activePlayer.protected = true;
    helpingFunctionsFight.disableFightButtons();
    helpingFunctionsMove.switchPlayers();
    helpingFunctionsFight.enableFightButtons();
}
};
var userInterface = {
  newGame() {
      location.reload();
  },
  gameRules() {
      alert("For each turn, a player can move from one to three boxes (horizontally or vertically) before ending their turn. They obviously can not pass through obstacles directly.If a player passes over a box containing a weapon, they leave their current weapon on site and replace it with the new one.If players cross over adjacent squares (horizontally or vertically), a battle begins.During combat, the game works is as follows:Each player attacks in turn.The damage depends on the player's weapon.The player can choose to attack or defend against the next shot.If the player chooses to defend themselves, they sustain 50% less damage than normal")
  },
  showResults(player) {
      $("#P1Attack, #P1Defend, #P2Attack, #P2Defend").hide();
      $("#gameBoard").remove();
      $("#box").append("<h2> Game Over</h2>");
      if (player === player1) {
          $("#box").append("<h5>The winner is the knight king</h5>");
      } else {
          $("#box").append("<h5>The winner is Arya Stark</h5>");
      }
      $("#box").append(`<button id="playAgain">Play Again</button>`);
      $("#playAgain").click(userInterface.newGame);
  }
};
var lifePointsFunction = {
  calculate() {
      if (passivePlayer.protected) {
          passivePlayer.lifePoints -= activePlayer.weapon.damage / 2;
          passivePlayer.protected = false;
      } else {
          passivePlayer.lifePoints -= activePlayer.weapon.damage;
      }
  },
  setNegativeLPToZero() {
      if (activePlayer.lifePoints < 0) {
          activePlayer.lifePoints = 0;
      }
      if (passivePlayer.lifePoints < 0) {
          passivePlayer.lifePoints = 0;
      }
  },
  update() {
      if (activePlayer === player1) {
          $("#lifePointsp1").text(activePlayer.lifePoints);
          $("#lifePointsp2").text(passivePlayer.lifePoints);
      } else {
          $("#lifePointsp2").text(activePlayer.lifePoints);
          $("#lifePointsp1").text(passivePlayer.lifePoints);
      }
  }
};
var mainFunction = {
  placePlayers() {
      var randomCellPlayer1 = helpingFunctionsPlace.selectRandomCell();
      var randomCellPlayer2 = helpingFunctionsPlace.selectRandomCell();
      var isnotAvailableP1 = helpingFunctionsPlace.checkAvailability(randomCellPlayer1);
      var isnotAvailableP2 = helpingFunctionsPlace.checkAvailability(randomCellPlayer2);
      var doTheyTouch = helpingFunctionsPlace.checkTouch(randomCellPlayer1, randomCellPlayer2);
      if (isnotAvailableP1 || doTheyTouch || isnotAvailableP2 || (randomCellPlayer2 === randomCellPlayer1)) {
          return this.placePlayers();
      } else {
          $(`[data-cell=${randomCellPlayer2}]`).addClass('player2');
          $(`[data-cell=${randomCellPlayer1}]`).addClass('player1');
      }
    },
 movePlayer() {
    var selectedCellNumber = $(this).attr(`data-cell`);
    var playerCellNumber;
    helpingFunctionsMove.switchPlayers();
    if (activePlayer === player1) {
        playerCellNumber = $(".player1").attr(`data-cell`);
    } else {
        playerCellNumber = $(".player2").attr(`data-cell`);
    }
    var range = helpingFunctionsMove.playerRange(playerCellNumber);
    if (helpingFunctionsMove.inRange(selectedCellNumber, playerCellNumber, range)) {
        helpingFunctionsMove.changeWeapons(selectedCellNumber, this);
        $(`.${activePlayer.name}`).removeClass(`${activePlayer.name}`);
        $(this).addClass(`${activePlayer.name}`);
        activePlayer.position = selectedCellNumber;
        if (activePlayer === player1) {
            passivePlayer = player2;
            $("#damagep1").text(activePlayer.weapon.damage);
        } else {
            passivePlayer = player1;
            $("#damagep2").text(activePlayer.weapon.damage);
        }
        if (helpingFunctionsPlace.checkTouch($(".player1").attr(`data-cell`), $(".player2").attr(`data-cell`))) {
            helpingFunctionsFight.enableFightButtons();
        }
    } else {
        mainFunction.movePlayer();

    }
},
attack() {
   lifePointsFunction.calculate();
   lifePointsFunction.setNegativeLPToZero();
   lifePointsFunction.update();
   if (passivePlayer.lifePoints === 0 || activePlayer.lifePoints === 0) {
       if (player1.lifePoints === 0 || player1.lifePoints < 0) {
           userInterface.showResults(player2);
           return;
       } else {
           userInterface.showResults(player1);
           return;
       }
   }
   helpingFunctionsFight.disableFightButtons();
   helpingFunctionsMove.switchPlayers();
   helpingFunctionsFight.enableFightButtons();
}
};
var obstacle = new Obstacle("obstacle");
var gun = new Weapon("weapongun", 50);
var sword = new Weapon("weaponsword",30);
var pike = new Weapon("weaponpike",  20);
var mace = new Weapon("weaponmace",  40);
var dagger = new Weapon("weapondagger", 10);
var player1= new Player("player1",  $('.player1').attr(`data-cell`));
var player2= new Player("player2", $('.player2').attr(`data-cell`));
var activePlayer = player2;
var passivePlayer = player1;
function Obstacle(name) {
	this.name = name;
}
Obstacle.prototype.place = function(){
  for (var i = 0; i < 12; i++) {
      helpingFunctionsPlace.placeItem(this.name);
  }
}
function Weapon(name,damage) {
    this.name = name;
    this.damage = damage;
}
Weapon.prototype.place = function(){
  helpingFunctionsPlace.placeItem(this.name)
}
function Player(name, position) {
    this.name = name;
    this.weapon = dagger;
    this.position = position;
    this.lifePoints = 100;
    this.protected = false;
}
gameBoard.createGrid();
obstacle.place();
gun.place();
sword.place();
pike.place();
mace.place();
mainFunction.placePlayers();
helpingFunctionsPlace.showDamageAndLifePoints();
$(document).ready(function(){
  $(".grid_item").click(mainFunction.movePlayer);
  $("#P1Attack,#P2Attack").click(mainFunction.attack);
  $("#P1Defend,#P2Defend").click(helpingFunctionsFight.defend);
  $("#newgame,#playAgain").click(userInterface.newGame);
  $("#gamerules").click(userInterface.gameRules);
});
