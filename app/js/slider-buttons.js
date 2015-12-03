'use strict';

angular.module('App')
  .controller('SliderButtonsCtrl', function ($scope, $rootScope, $timeout, $element) {
    // jslider-value

    $rootScope.$watch('navigateTo', function() {
      if ($rootScope.navigateTo == $scope.question.name) {
        //navigating to this element
        $timeout(function(){
          $scope.setBackground()
        });
      }
    });

    $rootScope.$watch('navigateFrom', function() {
      if ($rootScope.navigateTo == $scope.name) {
        //navigating from this element
      }
    });

    $timeout(function(){
      $($element).find('.jslider:not(.vertical) td').append('<div class="jslider-true-bg"><div></div><img src="img/slider-true-bg.png"/></div>');
      $($element).find('.jslider.vertical td').append('<div class="jslider-true-bg"><div></div><img src="img/slider-true-bg-vertical.png"/></div>');
       $scope.sliderBackground = $($element).find('.jslider:not(.vertical) .jslider-true-bg div');
       $scope.sliderIndicator = $($element).find('.jslider:not(.vertical) .jslider-pointer').eq(0);
       $scope.sliderBackgroundVertical = $($element).parent().find('.vertical .jslider-true-bg div');
       $scope.sliderIndicatorVertical = $($element).parent().find('.vertical .jslider-pointer').eq(0);
       $timeout(function(){$scope.setBackground();},100);
    })

    $scope.setAnswer = function () {
      $rootScope.showTooltip = false;
      $rootScope.controls.questionHasAnswer = false;
      for (var t in $rootScope.questionsData.question.text) {
        for (var i in $rootScope.questionsData.question.text[t].answers) {
          if ($rootScope.questionsData.question.text[t].answers[i].value == Math.round($rootScope.questionsData.question.text[t].answer)) {
            $rootScope.questionsData.question.text[t].answers[i].answer = true
            if (t == 1) $rootScope.controls.questionHasAnswer = true
          } else {
            $rootScope.questionsData.question.text[t].answers[i].answer = false
          }
        }
      }
    }

    $scope.setButtonAnswer = function(answer) {
        if (!!!answer.enabled) return;
        $rootScope.questionsData.question.text[1].answer = answer.value;
        $scope.setAnswer();
    }

    $scope.setBackground = function() {
      var left = parseFloat($($scope.sliderIndicator).css('left'));
      left += $($scope.sliderIndicator).width()/2-20;
      $($scope.sliderBackground).css('width', left);
      var top = parseFloat($($scope.sliderIndicatorVertical).css('top'));
      top += $($scope.sliderIndicatorVertical).height()/2-20;
      $($scope.sliderBackgroundVertical).css('height', top);
    }

    $scope.setLast = function (qs,isVertical) {
      $scope.question = qs;

          qs.text[0].options.round = 5
          var last = null
          for (var a in qs.text[0].answers) {
            if (!!last) {
              qs.text[0].options.halfway = (qs.text[0].answers[a].value-last.value) / 2 
              break
            } else {
                last = qs.text[0].answers[a]
            }
          }
          
          qs.text[0].options.realtime = true;

      if (!!qs.text[0].options) {
        qs.text[0].options.modelLabels = angular.copy(function (value) {
          if (!!$rootScope.questionsData.question) {
            //if (qs.name == $rootScope.questionsData.question.name) {  
                $rootScope.questionsData.question.text[0].roundedAnswer = value.toFixed(0);
                $rootScope.safeApply();
                return value.toFixed(0);
            //}
          }
        });
      }

      qs.text[0].options.callback = angular.copy(function(value, released) { 
        //$($element).find('.slider-wrap').attr('data-text', $rootScope.questionsData.question.show.answers[Math.round(value)].text);
          
        if (!!$rootScope.questionsData.question) {
          if (qs.name == $rootScope.questionsData.question.name) {    
            if (!!released) {
              for (var a in $rootScope.questionsData.question.text[0].answers) {
                    //console.log( $rootScope.questionsData.question.text[0].answer , $rootScope.questionsData.question.text[0].options.halfway,  parseFloat($rootScope.questionsData.question.text[0].answers[a].value)- $rootScope.questionsData.question.text[0].options.halfway , parseFloat($rootScope.questionsData.question.text[0].answers[a].value)+$rootScope.questionsData.question.text[0].options.halfway   )
                    if ($rootScope.questionsData.question.text[0].answer > (parseFloat($rootScope.questionsData.question.text[0].answers[a].value)- $rootScope.questionsData.question.text[0].options.halfway) &&  $rootScope.questionsData.question.text[0].answer < (parseFloat($rootScope.questionsData.question.text[0].answers[a].value)+$rootScope.questionsData.question.text[0].options.halfway)) {
                      $rootScope.questionsData.question.text[0].answer = $rootScope.questionsData.question.text[0].answers[a].value;
                      break
                    }
              }
              $rootScope.safeApply();
              $scope.toggleButtons(qs.text[1],$rootScope.questionsData.question.show.answer);
            } else {
              //released
            } 

            var left = parseFloat($($scope.sliderIndicator).css('left'));
            left += $($scope.sliderIndicator).width()/3;
            $($scope.sliderBackground).css('width', left);
            var top = parseFloat($($scope.sliderIndicatorVertical).css('top'));
            top += $($scope.sliderIndicatorVertical).height()/3;
            $($scope.sliderBackgroundVertical).css('height', top);
          }
        }
      })

      qs.text[0].verticalOptions = angular.copy(qs.text[0].options);
      qs.text[0].verticalOptions.vertical = true;

        for (var t in qs.text) {        
          for (var i in qs.text[t].answers) {
            if (qs.text[t].answers[i].value == qs.text[t].answer) {
              qs.text[t].answers[i].answer = true
            } else {
              qs.text[t].answers[i].answer = false
            }
          }
        }
    }

    $scope.toggleButtons = function(qs,sliderVal) {
      sliderVal = Math.round(parseFloat(sliderVal));

      var match = false;
      for (var t in qs.answers) {
        for (var e in qs.answers[t].enabledWhen) {
          if (qs.answers[t].enabledWhen[e] == sliderVal) {
            match = true;
            break;
          }
        }

        if (match) {
          qs.answers[t].enabled = true;
        } 
        else {
          qs.answers[t].enabled = false;
          qs.answers[t].answer = false;

          //answer has been invalidated by button being disabled
          if (qs.answers[t].value == $rootScope.questionsData.question.text[1].answer) {
            $rootScope.questionsData.question.text[1].answer = false;
          }
        }
        match = false;
      }
      //console.log(qs);
    }
});
