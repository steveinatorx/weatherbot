'use strict';

/**
 * @ngdoc directive
 * @name weatherbotApp.directive:marquee
 * @description
 * # marquee
 */
angular.module('weatherbotApp')
  .directive('mymarquee', function () {
    return {
      template: '<p ng-show="targetHide">{{targetA | minMaxString}}</p>',
      restrict: 'E',
      scope: {
        data:"=",
        tick:"=",
        index:"="
      },
      link: function postLink(scope, element, attrs) {

          var targetIdx = parseInt(attrs["myIndex"]);
          scope.targetIdx=targetIdx;

        attrs.$observe('myTick',function(newVal){
          var hide=attrs["myTick"];
          scope.targetHide=true;

          if(attrs['myContent'] != "") {
            var contentObj = eval(attrs['myContent']);
            var contentLen = contentObj.length;
            //scope.targetIdx+=2;
              scope.targetA=contentObj[scope.targetIdx].title;
              //scope.targetB=contentObj[scope.targetIdx+1];
              scope.targetIdx+=1;
              //scope.targetHide=(hide==='true')?true:false;
              if(scope.targetIdx>(contentLen-1)) scope.targetIdx=0;
          }
        });
        attrs.$observe('myContent',function(newVal){

            if(attrs['myContent'] != "") {

              //var targetIdx = parseInt(attrs["myIndex"]);
              var contentObj = eval(attrs['myContent']);
              scope.targetA=contentObj[scope.targetIdx].title;
              scope.targetHide=false;
              //console.log(contentObj[0]);
            }

        });
        //scope.text='farl';
        //element.text('this is the marquee directive');
      }
    }
  });
