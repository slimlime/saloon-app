(function(){
  'use strict';
  angular.module('app')
    .directive('done', doneDirective);

  function doneDirective(EventSrv, EventUtils){
    var directive = {
      restrict: 'E',
      templateUrl: 'js/components/done.html',
      scope: {
        userData: '=userData',
        elt: '=elt'
      },
      link: link
    };
    return directive;

    function link(scope, element, attrs){
      if(!checkParams(attrs)){ return; }
      var vm = {};
      scope.vm = vm;

      vm.doneLoading = false;

      vm.isDone = function(elt){ return EventUtils.isDone(scope.userData, elt); };
      vm.done = done;
      vm.undone = undone;

      function done(elt){
        if(!vm.doneLoading){
          vm.doneLoading = true;
          return EventSrv.done(elt).then(function(data){
            EventUtils.setDone(scope.userData, data);
            vm.doneLoading = false;
          }, function(){
            vm.doneLoading = false;
          });
        }
      }

      function undone(elt){
        if(!vm.doneLoading){
          vm.doneLoading = true;
          return EventSrv.undone(elt).then(function(data){
            EventUtils.setUndone(scope.userData, data);
            vm.doneLoading = false;
          }, function(){
            vm.doneLoading = false;
          });
        }
      }
    }
  }

  function checkParams(attrs){
    if(!attrs.userData){ console.error('Directive "done" need a "userData" argument !'); return false; }
    if(!attrs.elt){ console.error('Directive "done" need a "elt" argument ! (session or exponent)'); return false; }
    return true;
  }
})();