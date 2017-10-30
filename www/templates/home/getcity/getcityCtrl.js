angular.module('getcityController', [])
    .controller('getcityCtrl',function($scope,ApiService,$location,$ionicScrollDelegate,$timeout,$stateParams,$state,$ionicLoading,$rootScope){
      //$scope.nowcity = sessionStorage.getItem('city');
      $scope.poscity = sessionStorage.getItem('nowcity');
      $scope.$on('nowcityChange',function(){
        $scope.poscity = sessionStorage.getItem('nowcity');
      })
      if(sessionStorage.getItem('lng') && !sessionStorage.getItem('nowcity')){
        var map = new AMap.Map("map", {
          resizeEnable: true,
          center:[sessionStorage.getItem('lng'),sessionStorage.getItem('lat')],
          zoom:16
        });
        map.getCity(function(data) {
          console.log(data);
          var cityinfo = data.city;
          sessionStorage.setItem('nowcity',cityinfo);
          ApiService.getSysCity({name:encodeURI(cityinfo,'UTF-8')}).success(function(res){
            if(res.success){
              sessionStorage.setItem('nowcityId',res.dataObject.id);
              $rootScope.$broadcast('nowcityChange');
            }
          })
        });
      }
      if(sessionStorage.getItem('isFailure') == 1){
        mapPosition();
      }
      $scope.$on('lngChange',function(){
          if(sessionStorage.getItem('isFailure') == 1){
            mapPosition();
          }else{
            var map = new AMap.Map("map", {
              resizeEnable: true,
              center:[sessionStorage.getItem('lng'),sessionStorage.getItem('lat')],
              zoom:16
            });
            map.getCity(function(data){
              var cityinfo = data.city;
              sessionStorage.setItem('nowcity',cityinfo);
              ApiService.getSysCity({name:encodeURI(cityinfo,'UTF-8')}).success(function(res){
                if(res.success){
                  sessionStorage.setItem('nowcityId',res.dataObject.id);
                  $rootScope.$broadcast('nowcityChange');
                }
              })
            });
          }
        });
        $scope.areaArr = ["全城"];
          //获取城市
          $scope.provinceArr = [];
          ApiService.getSysRegionList({parentId:1}).success(function(data){
             console.log(data);
             if(data.success){
               $scope.provinceArr=data.dataObject;
             }
              // $scope.allcityArr = pySegSort(cityArr);
          });
          $scope.goCity = function(id) {
            if($stateParams.ischange){
              $state.go('choosecity',{
                pid:id,
                ischange:$stateParams.ischange
              })
            }else{
              $state.go('choosecity',{
                pid:id
              })
            }
          }
          //最近访问的城市
          if($stateParams.ischange){
            $scope.historyShow = false;
          }else{
            $scope.historyShow = true;
            if(localStorage.getItem("visited")){
        			$scope.visitedCity = JSON.parse(localStorage.getItem("visited"));
        		}else{
        			$scope.visitedCity = [];
        		}
          }
          $scope.choosehistory = function(name,id){
            localStorage.setItem('city',name);
            localStorage.setItem('cityId',id);
            $scope.visitedCity.unshift({name:name,id:id});
            for(var i=0;i<$scope.visitedCity.length;i++){
              var a = $scope.visitedCity[i];
              for(var j=i+1;j<$scope.visitedCity.length;j++){
                if($scope.visitedCity[j].name == a.name){
                  $scope.visitedCity.splice(j,1);
                  j=j-1;
                }
              }
            }
            if($scope.visitedCity.length>6){
              $scope.visitedCity.pop();
            }
            localStorage.setItem("visited",JSON.stringify($scope.visitedCity));
            history.go(-1);
          }
          //选择当前定位城市
          $scope.choosenow = function(){
            if(sessionStorage.getItem('nowcity') == ''){
              if($stateParams.ischange){
                var userdata = JSON.parse(localStorage.getItem('userdata'));
                ApiService.changedata({
                  userId:userdata.userId,
                  token:userdata.token,
                  cityId:sessionStorage.getItem('nowcityId')
                }).success(function(res){
                  if(res.success){
                    userdata.city = $scope.poscity;
                    localStorage.setItem('userdata',JSON.stringify(userdata));
                    $ionicLoading.show({
                        template: "修改成功",
                        noBackdrop: 'true',
                      });
                      $timeout(function() {
                        $ionicLoading.hide();
                        history.go(-1);
                      }, 2000);
                  }else{
                    $ionicLoading.show({
                        template: "修改失败",
                        noBackdrop: 'true',
                      });
                      $timeout(function() {
                        $ionicLoading.hide();
                        history.go(-2);
                      }, 2000);
                  }
                })
              }else{
                localStorage.setItem('city',$scope.poscity);
                localStorage.setItem('cityId',sessionStorage.getItem('nowcityId'));
                $scope.visitedCity.unshift({name:$scope.poscity,id:sessionStorage.getItem('nowcityId')});
                for(var i=0;i<$scope.visitedCity.length;i++){
                  var a = $scope.visitedCity[i];
                  for(var j=i+1;j<$scope.visitedCity.length;j++){
                    if($scope.visitedCity[j].name == a.name){
                      $scope.visitedCity.splice(j,1);
                      j=j-1;
                    }
                  }
                }
                if($scope.visitedCity.length > 6){
                  $scope.visitedCity.pop();
                }
                localStorage.setItem("visited",JSON.stringify($scope.visitedCity));
                history.go(-1);
              }
            }
          }
          function mapPosition(){
            var map = new AMap.Map("map", {
              resizeEnable: true,
              zoom:16
            });
            map.plugin('AMap.Geolocation', function() {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true,        //显示定位按钮，默认：true
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                useNative:true
            });
              map.addControl(geolocation);
              geolocation.getCurrentPosition();
              AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
              AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
            });
            //解析定位结果
            function onComplete(data) {
              console.log(data.position.getLng(),data.position.getLat());
              sessionStorage.setItem('isFailure',2);
              sessionStorage.setItem('lng',data.position.getLng());
              sessionStorage.setItem('lat',data.position.getLat());
              $rootScope.$broadcast('lngChange');
              $ionicLoading.hide();
            }
           //解析定位错误信息
            function onError(data) {
              $ionicLoading.hide();
              var centerLng = map.getCenter();
              sessionStorage.setItem('isFailure',2);
              sessionStorage.setItem('lng',centerLng.lng);
              sessionStorage.setItem('lat',centerLng.lat);
              $rootScope.$broadcast('lngChange');
            }
          }
});
