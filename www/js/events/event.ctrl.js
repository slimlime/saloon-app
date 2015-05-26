(function(){
  'use strict';
  angular.module('app')
    .controller('EventCtrl', EventCtrl)
    .controller('EventInfosCtrl', EventInfosCtrl)
    .controller('EventProgramCtrl', EventProgramCtrl)
    .controller('EventSessionsCtrl', EventSessionsCtrl)
    .controller('EventExponentsCtrl', EventExponentsCtrl)
    .controller('EventSessionCtrl', EventSessionCtrl)
    .controller('EventExponentCtrl', EventExponentCtrl)
    .controller('EventScheduleCtrl', EventScheduleCtrl);

  function EventCtrl($scope, event){
    var vm = {};
    $scope.vm = vm;

    vm.event = event;
  }

  function EventInfosCtrl($scope, $stateParams, EventSrv, event){
    var vm = {};
    $scope.vm = vm;

    vm.loading = false;
    vm.event = event;
    vm.doRefresh = doRefresh;

    function doRefresh(){
      vm.loading = true;
      EventSrv.refreshEvent($stateParams.eventId).then(function(event){
        vm.event = event;
        vm.loading = false;
      }, function(err){
        vm.loading = false;
      });
    }
  }

  function EventProgramCtrl($scope, EventUtils, event){
    var vm = {};
    $scope.vm = vm;

    vm.event = event;
    vm.days = EventUtils.getSessionDays(event.sessions);
    vm.bgSessions = [
      'img/event/sessions1.jpg',
      'img/event/sessions2.jpg',
      'img/event/sessions3.jpg'
    ];
    vm.bgExponents = 'img/event/exponents.jpg';
  }

  function EventSessionsCtrl($scope, $stateParams, EventUtils, event, userData){
    // TODO : add header button to go to current session
    var vm = {};
    $scope.vm = vm;

    vm.event = event;
    vm.userData = userData;
    vm.day = parseInt($stateParams.day);
    vm.sessions = EventUtils.getSessionsForDay(event.sessions, vm.day);

    vm.isFavorite = function(elt){ return elt ? EventUtils.isFavorite(userData, elt) : false; };
  }

  function EventExponentsCtrl($scope, EventUtils, event, userData){
    var vm = {};
    $scope.vm = vm;

    vm.event = event;
    vm.userData = userData;
    vm.bgExponents = [
      'img/event/exponent1.jpg',
      'img/event/exponent2.jpg',
      'img/event/exponent3.jpg',
      'img/event/exponent4.jpg',
      'img/event/exponent5.jpg',
      'img/event/exponent6.jpg',
      'img/event/exponent7.jpg',
      'img/event/exponent8.jpg',
      'img/event/exponent9.jpg'
    ];

    vm.isFavorite = function(elt){ return elt ? EventUtils.isFavorite(userData, elt) : false; };
  }

  function EventSessionCtrl($scope, userData, session){
    var vm = {};
    $scope.vm = vm;

    vm.userData = userData;
    vm.elt = session;
    vm.similar = [];
  }

  function EventExponentCtrl($scope, userData, exponent){
    var vm = {};
    $scope.vm = vm;

    vm.userData = userData;
    vm.elt = exponent;
    vm.similar = [];
  }

  function EventScheduleCtrl($scope, $timeout, EventUtils, event, userData){
    var vm = {};
    $scope.vm = vm;

    vm.event = event;
    vm.userData = userData;
    vm.showMoodBars = [];

    vm.isDone = function(elt){ return elt ? EventUtils.isDone(userData, elt) : false; };
    vm.exponentDone = exponentDone;

    $scope.$on('$ionicView.enter', function(){
      vm.sessions = EventUtils.getFavoriteSessions(event, userData).sort(sortSessions);
      // TODO : do this only during event
      // TODO : add icon 'moins' for timeline
      /*console.log(vm.sessions);
      var now = new Date('06/11/2015').getTime();
      var currentSessionIndex = _.findIndex(vm.sessions, function(s){ return s.end > now; }); // sessions should be sorted by start:end:name
      vm.finishedSessions = _.take(vm.sessions, currentSessionIndex);
      vm.currentSession = vm.sessions[currentSessionIndex];
      var tmp = _.partition(_.drop(vm.sessions, currentSessionIndex+1), function(s){ return s.start <= vm.currentSession.end; });
      vm.nearSessions = tmp[0];
      vm.farSessions = tmp[1];
      console.log('finishedSessions', vm.finishedSessions);
      console.log('currentSession', vm.currentSession);
      console.log('nearSessions', vm.nearSessions);
      console.log('farSessions', vm.farSessions);
      vm.showFarSessions = false;*/

      vm.exponents = EventUtils.getFavoriteExponents(event, userData).sort(sortExponents);
    });

    function sortSessions(a, b){
      if(a.start !== b.start) return a.start - b.start;
      else if(a.end !== b.end) return a.end - b.end;
      else if (a.name > b.name) return 1;
      else if (a.name < b.name) return -1;
      return 0;
    }
    function sortExponents(a, b){
      var aDone = vm.isDone(a);
      var bDone = vm.isDone(b);
      if(aDone === bDone){
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      } else if(aDone){ return 1; }
      else { return -1; }
    }

    function exponentDone(value, index){
      if(value && !vm.showMoodBars[index]){
        $timeout(function(){
          vm.showMoodBars[index] = false;
        }, 3000);
      }
      vm.showMoodBars[index] = value;
    }
  }
})();
