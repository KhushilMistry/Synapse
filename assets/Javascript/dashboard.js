var app = angular.module('synapse');

app.controller('DashboardController', function($scope, jQuery, DashboardService) {

  $scope.getEventList = function() {

    $scope.loading = true;

    DashboardService.getParticipantDetails().then(function(response) {
      console.log(response);
      $scope.participant = response;
      $scope.participantEvents = response.events;
      return DashboardService.getEventList();
    }).then(function(response) {
      $scope.loading = false;
      $scope.events = response;
    }).catch(function(err) {
      $scope.loading = false;
      console.log(err);
    });


  }

  $scope.initializeFormData = function() {
      $scope.eventsFormData = {
          "SY17E001": {},
          "SY17E002": {},
          "SY17E003": {},
          "SY17E004": {},
          "SY17E005": {},
          "SY17E006": {},
          "SY17E007": {},
          "SY17E008": {},
          "SY17E009": {},
          "SY17E010": {},
          "SY17E011": {},
          "SY17E012": {},
          "SY17E013": {},
          "SY17E014": {},
          "SY17E015": {},
          "SY17E016": {}
      };
  }

  $scope.initializeFormData();

  var selectedCheckboxes = [];

  $scope.closeModal = function() {

    selectedCheckboxes = [];

    $(':checkbox:checked').each(function(i){
      this.checked = false;
    });

    $scope.initializeFormData();

  }

  $scope.registerEvent = function(eventID) {

    $(':checkbox:checked').each(function(i){
      selectedCheckboxes[i] = $(this).val();
    });

    console.log("eventID", eventID);
    // console.log(selectedCheckboxes);
    // console.log($scope.eventsFormData[eventID]);
    // console.log($scope.eventsFormData);

    var eventObj = {
      "id": eventID,
      "data": $scope.eventsFormData[eventID]
    };

    console.log("eventObj:", eventObj);

    // if (confirm('Confirm register?')) {
    //
    //   DashboardService.register(event).then(function(response) {
    //     console.log(response);
    //   });
    //
    // }



  }

});

// Controller END

app.factory('DashboardService', function($firebaseArray, $q, $http) {

  var ref = firebase.database().ref().child('participants');
  var participant = {};

  return {
    getParticipantDetails: getParticipantDetails,
    getEventList: getEventList,
    register: register
  };

  function getParticipantDetails() {

    var defer = $q.defer();
    var events = [];
    var list = $firebaseArray(ref);

    list.$ref().orderByChild('email')
    .startAt('dhwanil_95@yahoo.com')
    .endAt('dhwanil_95@yahoo.com')
    .on('value', function(snapshot) {

      var data = snapshot.val();

      for(value in data) {
        participant = data[value];
        participant.$id = value;
      }

      defer.resolve(participant);

    });

    return defer.promise
  }

  function getEventList() {

    var defer = $q.defer();

    var loadingEventsData;

    $http.get('/assets/json/events.json').then(function(response) {

      // var filteredEvents = response.data.filter(function(event) {
      //   return participant.events.findIndex(function(participantEvent) {
      //     if (participantEvent.id !== event.id) {
      //       return event;
      //     }
      //   });
      // });

      defer.resolve(response.data);
    }).catch(function(err) {
      console.log(err);
      defer.reject(err);
    });

    return defer.promise;

  }

  function register(event) {

    var defer = $q.defer();

    if (participant.events) {
      participant.events.push(event);
    } else {
      participant.events = [];
      participant.events.push(event);
    }

    var data = $firebaseArray(ref);

    data.$loaded().then(function(data) {
      var index = data.$indexFor(participant.$id);
      data[index] = participant;
      data.$save(index);
      defer.resolve();
    });

    return defer.promise;

  }

});
