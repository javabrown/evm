// Code goes here

var app = angular.module("myapp", []);


app.controller("FraudVote", function($scope, $http) {
  $scope.data_template = {
    "aap": {
      "hashKey": "aap",
      "condidateID": "1",
      "condidateName": "AAP",
      "logo": "img/aap-logo.jpg",
      "voteCount": 0,
      "vote1": 0,
      "isWinner": false
    },
    "bjp": {
      "hashKey": "bjp",
      "condidateID": "2",
      "condidateName": "BJP",
      "logo": "img/bjp.png",
      "voteCount": 0,
      "vote1": 0,
      "isWinner": false
    },
    "inc": {
      "hashKey": "inc",
      "condidateID": "3",
      "condidateName": "Congress Party",
      "logo": "img/inc.png",
      "voteCount": 0,
      "vote1": 0,
      "isWinner": false
    },
    "sp": {
      "hashKey": "sp",
      "condidateID": "4",
      "condidateName": "Samajwaadi Party",
      "logo": "img/sp.jpg",
      "voteCount": 0,
      "vote1": 0,
      "isWinner": false
    },
    
    "bsp": {
      "hashKey": "bsp",
      "condidateID": "5",
      "condidateName": "BahujanSamaj Party",
      "logo": "img/bsp.png",
      "voteCount": 0,
      "vote1": 0,
      "isWinner": false
    },     
  };
  
  $scope.voteControl = {
    totalVoteCount : 0,
    selected: '',
    on: false,
    done: false,
    showResult: false,
    
    //isFraud: false,
    winnerKey: "none"
  };

  $scope.data =
    ((typeof(Storage) !== "undefined") && (localStorage.voteData)) ?
    JSON.parse(localStorage.voteData) : angular.copy($scope.data_template);
    
  $scope.voteControl =
    ((typeof(Storage) !== "undefined") && (localStorage.voteControl)) ?
    JSON.parse(localStorage.voteControl) : $scope.voteControl;

  //Audio Files.
  $scope.wav_vote_beep = new Audio('https://raw.githubusercontent.com/javabrown/resources/master/audio/mp3/beep.mp3');
  $scope.wav_machine_beep = new Audio('https://raw.githubusercontent.com/javabrown/resources/master/audio/mp3/button.mp3');

  $scope.reset = function() {
    localStorage.clear();
    $scope.voteControl.selected = '';
    $scope.voteControl.on = false
    $scope.voteControl.done = false;
    $scope.voteControl.showResult = false;
    $scope.voteControl.winnerKey = "none";
    $scope.voteControl.totalVoteCount = 0;

    $scope.data =
      ((typeof(Storage) !== "undefined") && (localStorage.voteData)) ?
      JSON.parse(localStorage.voteData) : angular.copy($scope.data_template);

    $scope.voteControl =
      ((typeof(Storage) !== "undefined") && (localStorage.voteControl)) ?
      JSON.parse(localStorage.voteControl) : $scope.voteControl;

    $scope.saveData();

    //alert(JSON.stringify($scope.data));

  }

  $scope.fixVoteWinner = function() {
    $scope.saveData();
    //alert($scope.voteControl.winnerKey);
  }

  $scope.chengeEvnt = function(index) {
    $scope.activeRow = index; // get the index when changing the radio button
    // alert($scope.activeRow);
  }

  $scope.startVoting = function() {

    $scope.reset();
    $scope.beep();
    $scope.voteControl.on = true;
    $scope.voteControl.done = false;
    $scope.voteControl.showResult = false;
    
   
    
    setTimeout(function() {
      $scope.$apply();
    }, 1);
  }

  $scope.stopVoting = function() {
    $scope.beep();
    $scope.voteControl.on = false;
    $scope.voteControl.showResult = false;
    $scope.voteControl.done = true;
    
    $scope.countVote();
  }

  $scope.countVote = function() {
    $scope.beep();
    $scope.voteControl.on = false;
    $scope.voteControl.done = false;
    $scope.voteControl.showResult = true;
    
    $scope.calculateTotal();

    if ($scope.voteControl.winnerKey && $scope.voteControl.winnerKey !== 'none') {
      $scope.hackVote();
    }
    
    $scope.saveData();
    
  }
  
  $scope.onWinSelectChange = function(){
    $scope.calculateTotal();


    //alert($scope.voteControl.winnerKey);
    if ($scope.voteControl.winnerKey && $scope.voteControl.winnerKey !== 'none') {
      $scope.hackVote();
    }
    
    $scope.saveData();
  }

  $scope.calculateTotal = function() {
    var voteArr = new Array();
    var total = 0;
    
    for (partyKey in $scope.data) {
      voteArr.push($scope.data[partyKey].voteCount);
      total = total + $scope.data[partyKey].voteCount;
    }

    var maxVote = Math.max.apply(null, voteArr);
    $scope.voteControl.totalVoteCount = total;
    
    for (partyKey in $scope.data) {
      $scope.data[partyKey].vote1 = $scope.data[partyKey].voteCount;
      $scope.data[partyKey].isWinner = false;
      if (maxVote === $scope.data[partyKey].voteCount) {
        $scope.data[partyKey].isWinner = true;
      }
    }
  }
  
  $scope.isDrawResult = function() {
    var arr = new Array();
  
    for (partyKey in $scope.data) {
      arr.push($scope.data[partyKey].vote1);
    }

    var maxVote = Math.max.apply(null, arr);
    var c =0;
    
    for (partyKey in $scope.data) {
        if($scope.data[partyKey].vote1 == maxVote){
          c = c + 1;
        }
    }
    
    return c > 1;
  }

  $scope.hackVote = function() {
    var c = 0;
    var fixedWinnerVoteCount = 0;
    var voteArr = new Array();

    for (partyKey in $scope.data) {
      c = c + $scope.data[partyKey].voteCount;
      voteArr.push($scope.data[partyKey].voteCount);

      if (partyKey === $scope.voteControl.winnerKey) {
        fixedWinnerVoteCount = $scope.data[partyKey].voteCount;
      }
      $scope.data[partyKey].isWinner = false; //make everyone looser
    }

    var maxVote = Math.max.apply(null, voteArr);
    var fixWinner = $scope.data[$scope.voteControl.winnerKey];
     
    while (maxVote > 0 && fixWinner.vote1 <= maxVote) {
      for (partyKey in $scope.data) {
        if (partyKey !== $scope.voteControl.winnerKey && $scope.data[partyKey].vote1 > 0) {
          $scope.data[partyKey].vote1 = Number($scope.data[partyKey].vote1) - 1;
          fixWinner.vote1 = Number(fixWinner.vote1) + 1;
          
          if(fixWinner.vote1 > maxVote){
            break;
          }
        }
      }
    }
    
    fixWinner.isWinner = true;
    $scope.data[$scope.voteControl.winnerKey] = fixWinner;
    //alert("Total Vote = " + c + ", Max Vote = " + Math.max.apply(null, voteArr) + ", Fix Winner Vote ="+ fixWinner.vote1);
  }

  $scope.voteForPerson = function() {
    $scope.final = angular.copy($scope.voteControl.selected);
    $scope.vote($scope.final.hashKey);
    $scope.calculateTotal();
    $scope.voteBeep();
  }

  $scope.voteBeep = function() {
    //var audio = new Audio('http://soundbible.com/grab.php?id=1252&type=mp3');
    $scope.wav_vote_beep.play()
  }

  $scope.beep = function() {
    //var audio = new Audio('http://soundbible.com/grab.php?id=1950&type=mp3');
    $scope.wav_machine_beep.play();
  }

  $scope.vote = function(partyName) {
    if (typeof(Storage) !== "undefined") {
      if (localStorage.voteData) {
        $scope.data[partyName].voteCount =
          Number($scope.data[partyName].voteCount) + 1;
        $scope.saveData();
      }
    }
  }



  $scope.saveData = function() {
    localStorage.voteControl = (JSON.stringify($scope.voteControl));
    localStorage.voteData = (JSON.stringify($scope.data));
  }

})
