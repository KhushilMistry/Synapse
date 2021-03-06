var app = angular.module('synapse');

app.controller('RegisterController', function($scope, RegisterService, EmailService, $cookies) {

  $scope.register = function() {

    $scope.loading = true;

    EmailService.checkEmailExists($scope.participant.email).then(function() {
      return RegisterService.register($scope.participant);
    }).then(function(response) {
      $scope.loading = false;
      $cookies.put('email', $scope.participant.email);
      window.location.href = 'dashboard.html'
    }).catch(function(err) {
      console.log(err);
      $scope.loading = false;
      $scope.error = 'Email already exists';
    });

  }

});

app.factory('RegisterService', function($firebaseArray) {

  var ref = firebase.database().ref().child('participants');

  return {
    register: register
  };

  function register(participant) {
    var data = $firebaseArray(ref);
    return data.$add(participant);
  }

});
