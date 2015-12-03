'use strict';

angular.module('App')
   .controller('SliderMultipleCtrl', function ($element, $scope, $rootScope) {
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
      for (var t in $rootScope.questionsData.question.text) {
    		for (var i in $rootScope.questionsData.question.text[t].answers) {
    			if ($rootScope.questionsData.question.text[t].answers[i].value == $rootScope.questionsData.question.text[t].answer) {
    				$rootScope.questionsData.question.text[t].answers[i].answer = true
            $rootScope.controls.questionHasAnswer = true
    			} else {
    				$rootScope.questionsData.question.text[t].answers[i].answer = false
    			}
    		}
      }
  	}

    $scope.setBackground = function() {
      var left = parseFloat($($scope.sliderIndicator).css('left'));
      left += $($scope.sliderIndicator).width()/2;
      $($scope.sliderBackground).css('width', left);
      var top = parseFloat($($scope.sliderIndicatorVertical).css('top'));
      top += $($scope.sliderIndicatorVertical).height()/2;
      $($scope.sliderBackgroundVertical).css('height', top);
    }

    $scope.setLast = function (qs,isVertical) {
      for (var t in qs.text) {     

          qs.text[t].options.round = 5
          var last = null
          for (var a in qs.text[t].answers) {
            if (!!last) {
              qs.text[t].options.halfway = (qs.text[t].answers[a].value-last.value) / 2 
              break
            } else {
                last = qs.text[t].answers[a]
            }
          }
          qs.text[t].options.realtime = true;
          qs.text[t].verticalOptions = angular.copy(qs.text[t].options);
          qs.text[t].verticalOptions.vertical = true;
          qs.text[t].options.modelLabels = angular.copy(function (value) {
            //if (!!$rootScope.questionsData.question) {
              //if (qs.name == $rootScope.questionsData.question.name) {  
                  //$rootScope.questionsData.question.text[t].roundedAnswer = value.toFixed(0)
                  //console.log($rootScope.questionsData.question.text[t].roundedAnswer)
                  //$rootScope.safeApply()
                  return value.toFixed(0);
              //}
            //}
          })
          qs.text[t].options.answers = qs.text[t].answers
          qs.text[t].options.iterator = t
          qs.text[t].options.callback = angular.copy(function(value, released) {
            //$($element).find('.slider-wrap').attr('data-text', $rootScope.questionsData.question.show.answers[Math.round(value)].text);  
              
            if (!!$rootScope.questionsData.question) {
              if (qs.name == $rootScope.questionsData.question.name) {    
                if (!!released) {
                  for (var a in this.answers) {
                        //console.log( $rootScope.questionsData.question.text[0].answer , $rootScope.questionsData.question.text[0].options.halfway,  parseFloat($rootScope.questionsData.question.text[0].answers[a].value)- $rootScope.questionsData.question.text[0].options.halfway , parseFloat($rootScope.questionsData.question.text[0].answers[a].value)+$rootScope.questionsData.question.text[0].options.halfway   )
                        //console.log($rootScope.questionsData.question.text[this.iterator].answer , (parseFloat(this.answers[a].value)- this.halfway), (parseFloat(this.answers[a].value)+this.halfway))
                        if ($rootScope.questionsData.question.text[this.iterator].answer > (parseFloat(this.answers[a].value)- this.halfway) &&  $rootScope.questionsData.question.text[this.iterator].answer < (parseFloat(this.answers[a].value)+this.halfway)) {
                          $rootScope.questionsData.question.text[this.iterator].answer = this.answers[a].value
                          break
                        }
                  }
                  $rootScope.safeApply();
                } 
              }
            }
          })



        for (var i in qs.text[t].answers) {
          qs.text[t].last = qs.text[t].answers[i].value
        }

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
    }

});
