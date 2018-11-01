 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAhR_yzExNbikcLwiOYKRngld8j2pzlH54",
    authDomain: "train-schedule-a1180.firebaseapp.com",
    databaseURL: "https://train-schedule-a1180.firebaseio.com",
    projectId: "train-schedule-a1180",
    storageBucket: "train-schedule-a1180.appspot.com",
    messagingSenderId: "15695346028"
  };
  firebase.initializeApp(config);

  // Variable to reference the database
  var trainData = firebase.database();

  var currentTime = moment();

  //Capture Button Click
  $("#add-train").on("click", function() {
      event.preventDefault();

    
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm").subtract(10, "years").format("X");;
    var frequency = $("#frequency-input").val().trim();
    
    trainData.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        timeAdded: firebase.database.ServerValue.TIMESTAMP 
    });
  

    // Clears all of the text boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");

      return false;
 });
 
trainData.ref().on("child_added", function(childSnapshot) {

  var firebaseTrainName = childSnapshot.val().trainName;
  var firebaseDestination = childSnapshot.val().destination;
  var firebaseFirstTrain = childSnapshot.val().firstTrain;
  var firebaseFrequency = childSnapshot.val().frequency;
  
  var diffTime = moment().diff(moment.unix(firebaseFirstTrain), "minutes");
  var timeRemainder = moment().diff(moment.unix(firebaseFirstTrain), "minutes") % firebaseFrequency ;
  var minutes = firebaseFrequency - timeRemainder;

  var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A"); 
  
  // Correct times/info
  // console.log(minutes);
  // console.log(nextTrainArrival);
  // console.log(moment().format("hh:mm A"));
  // console.log(nextTrainArrival);
  // console.log(moment().format("X"));

  // Append train info to table on page
  $("#train-table > tbody").append("<tr><td>" + firebaseTrainName + "</td><td>" + firebaseDestination + "</td><td>" + firebaseFrequency + " mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");

});


