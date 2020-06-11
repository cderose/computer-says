gamePattern = [];
userPattern = [];

buttonColors = ["red", "blue", "green", "yellow"];

// PRE-GAME SETTINGS
var started = false;
var level = 0;

$(document).keypress(function(){
  if (!started){
    nextSequence();
    started = true;
  }
})

// GENERATE GAME PATTERN
function nextSequence(){
  // Set up level stats
  level++;
  $("h1").text("Level" + " " + level)
  userPattern = [];

  // Pick random color
  var randomNumber = Math.floor(Math.random() * 4);
  var randomColor = buttonColors[randomNumber];
  gamePattern.push(randomColor);

  // Loop through color array
  interval = 500
  var loop = function () {
    return new Promise(function (outerResolve) {
      var promise = Promise.resolve();
      var i = 0;
      var next = function () {
        $("#" + gamePattern[i]).fadeOut(100).fadeIn(100);
        playSound(gamePattern[i]);
        if (++i < gamePattern.length) {
          promise = promise.then(function () {
            return new Promise(function (resolve) {
              setTimeout(function () {
                resolve();
                next();
              }, interval);
            });
          });
        } else {
          outerResolve();
        }
      };
      next();
    });
  };

  loop().then(function () {
    console.log(gamePattern);
  });

}

// REGISTER USER PATTERN
$(".btn").click(function (){
  // var userColor = $(this).attr("id");
  var userColor = this.id;
  userPattern.push(userColor);
  animatePress(userColor);
  playSound(userColor);
  // console.log(userPattern);
  if(started){
    checkAnswer(userPattern.length-1);
  } else {
    console.log("game hasn't started yet");
  }

})

function animatePress(color){
  $("#" + color).addClass("pressed");
  setTimeout(function(){
    // $("#" + color).removeClass("pressed");
    $("#" + color).removeClass("pressed");
  }, 100);
}

// CONTROL ALL SOUNDS
function playSound(filename){
  var audio = new Audio("sounds/" + filename + ".mp3");
  audio.play();
}

// CHECK USER PATTERN AGAINST GAME PATTERN
function checkAnswer(currentLevel){
  if(userPattern[currentLevel] === gamePattern[currentLevel]){
    if(userPattern.length === gamePattern.length){
      setTimeout(function(){
        nextSequence();
      }, 1000);
    }
  } else {
    playSound("wrong");
    $("body").addClass("game-over");
    $("h1").text("Game Over! Press Any Key to Restart.");
    setTimeout(function(){
      // $("#" + color).removeClass("pressed");
      $("body").removeClass("game-over");
    }, 200);
    startOver();
  }
}

// RESET
function startOver(){
  started = false;
  level = 0;
  gamePattern = [];
}
