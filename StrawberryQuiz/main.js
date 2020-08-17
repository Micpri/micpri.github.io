//GLOBALS
PATH = document.URL.substr(0, document.URL.lastIndexOf('/')+1)
FNAME = document.URL.substr(document.URL.lastIndexOf('/')+1);
SCORE = 0;
QNUM = 0;
PAUSE = 2; // seconds

// FUNCTIONS
function loadJSON(filename) {

    return new Promise( function(resolve, reject) {

      var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
      xobj.open('GET', filename, true);
      xobj.addEventListener('load', function(evt){
          resolve(JSON.parse(xobj.responseText)[0]);
      });
      xobj.addEventListener('error', function(error){
          reject(error);
      })
      xobj.send(null);
    });
}

function getCorrectAnswer(question_object, qIndex) {

  return new Promise( function (resolve, reject){

    var Ans = question_object[qIndex].Answers;

    Object.keys(Ans).forEach(function(option){

      if (Ans[option].Points == 1){
        resolve(option);
      };
    });
  });
}

function populateQAdivs(question_object, qIndex, correctAns, allAns) {

  return new Promise(function(resolve, reject){

    // Populate Question div
    document.getElementById("question").innerHTML = qIndex +". " + question_object[qIndex].Question;

    // Populate Answer div
    Object.keys(question_object[qIndex].Answers).forEach(function(option){

      var li = document.createElement('li');
      li.setAttribute("id", option);
      var a = document.createElement('a');
      a.innerText = question_object[qIndex].Answers[option].Answer;
      li.appendChild(a)

      // if (QNUM == Object.keys(question_object).length-1){
      //   console.log("last q");
      //   a.setAttribute("href", PATH+"endpage.html");
      // };

      document.getElementById("ulist").appendChild(li);

      resolve(null);
    });
  });
}

function splashScore(score, question_object){

  loadJSON("scores.json").then( function(score_data) {

    // which key in JSON element to use
    var index;
    if( score < 5) {
      index = "low";
    } else if (score > 4 & score < 8) {
      index = "mid-low";
    } else if (score > 8 & score < 10) {
      index = "mid-high";
    } else {
      index = "high";
    }

    var final_score = document.createElement("h1");
    var title = document.createElement("h2");
    var comment = document.createElement("p");
    var img = document.createElement("img");

    final_score.innerText = score + " / " + Object.keys(question_object).length;
    title.innerText = score_data[index].title;
    comment.innerText = score_data[index].comment;
    img.src = score_data[index].img;

    document.getElementById("section").appendChild(title);
    document.getElementById("section").appendChild(final_score);
    document.getElementById("section").appendChild(comment);
    document.getElementById("section").appendChild(img);

    window.setTimeout(function () {
      window.location.href = "index.html";
    }, 1000 * 2 * 60);
  });

}

function evtButtonClick(ans, correctAns, allAns, question_object, qs, QNUM) {

  var color_correct = "rgb(0, 153, 51)";
  var color_incorrect = "rgb(30, 30, 30)";
  var color_blank = "rgb(70, 70, 70)";

  document.getElementById(ans).addEventListener("click", function () {

    // Make screen unresponsive
     var overlay = document.createElement("div");
     overlay.className = "overlay";
     var wrapper = document.getElementById('wrapper');
     wrapper.appendChild(overlay);

    // Grey out other options
    allAns.forEach( function(ea) {
      document.getElementById(ea).style.backgroundColor = color_blank;
    });

    // Change colour of div based on correct answer
    if (this.id == correctAns){
      this.style.backgroundColor = color_correct;
      SCORE += 1;
    } else {
      this.style.backgroundColor = color_incorrect;
      document.getElementById(correctAns).style.backgroundColor = color_correct;
    };

    // Some Delayed functionality
    window.setTimeout(function () {

      // Get rid of Q&A contents
      document.getElementById("question").innerHTML = "";
      document.getElementById("ulist").innerHTML = "";

      // Remove overlay (blank div)
      overlay.remove()

      // Increment and load next question or go to endpage
      QNUM++;
      if( QNUM < qs.length){
        loadQuestion(question_object, qs, QNUM);
      } else {
        splashScore(SCORE, question_object);
      }

    }, PAUSE * 1000);

  console.log("SCORE:", SCORE);
  });

};

var loadQuestion = function(question_object, qs, QNUM){

  var q = qs[QNUM];
  getCorrectAnswer(question_object, q).then(function(correctAns){

    var allAns = Object.keys(question_object[q].Answers);
    populateQAdivs(question_object, q, correctAns, allAns).then( function() {

      allAns.forEach(function(ans){
        evtButtonClick(ans, correctAns, allAns, question_object, qs, QNUM);
      });
    });
  });
}


//------------------------------------------------------------------------------
// MAIN
//------------------------------------------------------------------------------

// Load Quiz
if (FNAME == "quiz.html") {
  loadJSON("questions.json").then(function(question_object){
    var qs = Object.keys(question_object);
    loadQuestion(question_object, qs, QNUM);
  });
};
