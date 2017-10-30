angular.module('starter.directives', [])
.directive('star', function () {
    return {
     template: '<ul class="rating">' +
         '<li ng-repeat="star in stars" ng-class="star" ng-click="click($index + 1)">' +
         '</li>' +
         '</ul>',
         scope: {
            ratingValue: '='
          },
     controller: function($scope){
       $scope.ratingValue =$scope.ratingValue||0;
     },
     link: function (scope, elem, attrs) {
       elem.css("text-align", "center");
       var updateStars = function () {
         scope.stars = [];
         for (var i = 0; i <5; i++) {
           scope.stars.push({
             filled: i < scope.ratingValue
           });
         }
       };
       updateStars();
       scope.$watch('ratingValue', function (oldVal, newVal) {
         if (newVal) {
           updateStars();
         }
       });
     }
    };
})
.directive('starcheck', function () {
    return {
     template: '<ul class="rating">' +
         '<li ng-repeat="star in stars" ng-class="star" ng-click="click($index + 1)">' +
        //  '\u2605' +
         '</li>' +
         '</ul>',
         scope: {
            ratingValue: '='
          },
     controller: function($scope){
       $scope.ratingValue =$scope.ratingValue||0;
       $scope.click = function(val){
         $scope.ratingValue = val;
         sessionStorage.setItem('star',$scope.ratingValue);
         if(val!=0){
           $scope.stars = [];
           for (var i = 0; i <5; i++) {
             $scope.stars.push({
               filled: i < $scope.ratingValue
             });
           }
         }
       };
     },
     link: function (scope, elem, attrs) {
       elem.css("text-align", "center");
       var updateStars = function () {
         scope.stars = [];
         for (var i = 0; i <5; i++) {
           scope.stars.push({
             filled: i < scope.ratingValue
           });
         }
       };
       updateStars();
       scope.$watch('ratingValue', function (oldVal, newVal) {
         if (newVal) {
           updateStars();
         }
       });
     }
    };
})
.directive('cityPicker', function(cityPickerData, $ionicModal, $timeout, $ionicScrollDelegate, $rootScope) {
    return {
      restrict: 'EA',
      scope: true,
      template: '<div ng-click="modalShow()" class="cityPicker">' +
        '{{city_province+city_city+city_towns}}' +
        '<span class="right_arr"><span></div>',
      link: function(scope, ele, attr) {
        scope.cityData = cityPickerData;
        $ionicModal.fromTemplateUrl("js/templates/city-picker.html", {
          scope: scope,
          animation: "slide-in-up"
        }).then(function(modal) {
          scope.modal = modal;
        });

        scope.modalShow = function() {
          scope.modal.show();
          var inner_height = document.getElementById('city_picker_inner').offsetHeight
          scope.li_height = inner_height / 5;
        };
        scope.complete = function() {
          scope.modal.hide();
        };
        //Cleanup the modal when we are done with it!
        scope.$on("$destroy", function() {
          scope.modal.remove();
        });
        // Execute action on hide modal
        scope.$on("modal.hidden", function() {
          // Execute action
        });
        // Execute action on remove modal
        scope.$on("modal.removed", function() {
          // Execute action
        });

        var topValue = 0, // 上次滚动条到顶部的距离
          timer = null; // 定时器
        var oldTop_pro = newTop_pro = 0;
        var oldTop_city = newTop_city = 0;
        var oldTop_town = newTop_town = 0;
        //city_picker_inner高

        //  var inner_height = document.getElementById('city_picker_inner').offsetHeight
        //console.log(inner_height)
        scope.subCitys = scope.cityData[0].sub;
        scope.subTowns = scope.subCitys[0].sub;
        scope.provinceSelet = function() {
          provinceLog();
        }
        scope.citySelet = function() {
          cityLog();

        }
        scope.townSelet = function() {
          townLog();
        }

        function townLog() {
          if (timer) {
            $timeout.cancel(timer)
          }
          newTop_town = $ionicScrollDelegate.$getByHandle('townScroll').getScrollPosition().top;
          if (newTop_town === oldTop_town) {
            $timeout.cancel(timer);
            scope.provinceSeletTop = $ionicScrollDelegate.$getByHandle('townScroll').getScrollPosition().top;
            var index = scope.provinceSeletTop / scope.li_height;
            if (index == Math.ceil(index)) {
              if (scope.subTowns) {
                $rootScope.city_towns = scope.subTowns[Math.floor(index)].name
                $rootScope.$broadcast('cityPickerChange')
              }
            } else {
              if (index >= (Math.floor(index) + 0.5)) {
                $ionicScrollDelegate.$getByHandle('townScroll').scrollTo(0, scope.li_height * (Math.floor(index) + 1), true)
              } else {
                $ionicScrollDelegate.$getByHandle('townScroll').scrollTo(0, scope.li_height * (Math.floor(index)), true)
              }
            }

          } else {
            oldTop_town = newTop_town;
            timer = $timeout(townLog, 100);
          }
        }

        function cityLog() {
          if (timer) {
            $timeout.cancel(timer)
          }
          newTop_city = $ionicScrollDelegate.$getByHandle('cityScroll').getScrollPosition().top;
          if (newTop_city === oldTop_city) {
            $timeout.cancel(timer);
            scope.provinceSeletTop = $ionicScrollDelegate.$getByHandle('cityScroll').getScrollPosition().top;
            var index = scope.provinceSeletTop / scope.li_height;
            if (index == Math.ceil(index)) {
              scope.subTowns = scope.subCitys[Math.floor(index)].sub;
              $ionicScrollDelegate.$getByHandle('townScroll').scrollTop();
              $rootScope.city_city = scope.subCitys[Math.floor(index)].name
              $rootScope.$broadcast('cityPickerChange')
            } else {
              if (index >= (Math.floor(index) + 0.5)) {
                $ionicScrollDelegate.$getByHandle('cityScroll').scrollTo(0, scope.li_height * (Math.floor(index) + 1), true)
                scope.subTowns = scope.subCitys[Math.floor(index)].sub;
                console.log(scope.subTowns)
              } else {
                $ionicScrollDelegate.$getByHandle('cityScroll').scrollTo(0, scope.li_height * (Math.floor(index)), true)
                scope.subTowns = scope.subCitys[Math.floor(index)].sub;
                console.log(scope.subTowns)
              }
            }

          } else {
            oldTop_city = newTop_city;
            timer = $timeout(cityLog, 100);
          }
        }

        function provinceLog() {
          if (timer) {
            $timeout.cancel(timer)
          }
          newTop_pro = $ionicScrollDelegate.$getByHandle('provinceScroll').getScrollPosition().top
          if (newTop_pro === oldTop_pro) {
            $timeout.cancel(timer);
            scope.provinceSeletTop = $ionicScrollDelegate.$getByHandle('provinceScroll').getScrollPosition().top;
            var index = scope.provinceSeletTop / scope.li_height;
            if (index == Math.ceil(index)) {
              scope.subCitys = scope.cityData[Math.floor(index)].sub;
              $ionicScrollDelegate.$getByHandle('cityScroll').scrollTop()
              console.log(scope.cityData[Math.floor(index)]);
              //localStorage.setItem('cityPickerProvince',scope.cityData[Math.floor(index)])
              $rootScope.city_province = scope.cityData[Math.floor(index)].name;
              scope.city_province = scope.cityData[Math.floor(index)].name
              $rootScope.$broadcast('cityPickerChange');
              cityLog();
            } else {
              if (index >= (Math.floor(index) + 0.5)) {
                $ionicScrollDelegate.$getByHandle('provinceScroll').scrollTo(0, scope.li_height * (Math.floor(index) + 1), true)
                scope.subCitys = scope.cityData[Math.floor(index)].sub;
                console.log(scope.subCitys)
              } else {
                $ionicScrollDelegate.$getByHandle('provinceScroll').scrollTo(0, scope.li_height * (Math.floor(index)), true)
                scope.subCitys = scope.cityData[Math.floor(index)].sub;
                console.log(scope.subCitys)
              }

            }

          } else {
            oldTop_pro = newTop_pro;
            timer = $timeout(provinceLog, 100);
          }
        }
      }
    }
  })
