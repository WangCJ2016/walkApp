angular.module('choosecityController', [])
    .controller('choosecityCtrl',function($scope,ApiService,$location,$ionicScrollDelegate,$timeout,$stateParams,$state,$ionicLoading){
      $scope.nowcity = sessionStorage.getItem('city');
      $scope.poscity = sessionStorage.getItem('nowcity');
      $scope.cityArr = [];
      $scope.ischange = $stateParams.ischange
      ApiService.getSysRegionList({parentId:$stateParams.pid}).success(function(res){
        console.log(res);
        if(res.success){
          $scope.cityArr = res.dataObject;
        }
      })
      $scope.cityChoose = function(id,name){
        if($stateParams.ischange){
          var userdata = JSON.parse(localStorage.getItem('userdata'));
          ApiService.changedata({
            userId:userdata.userId,
            token:userdata.token,
            cityId:id
          }).success(function(res){
            if(res.success){
              userdata.city = name;
              localStorage.setItem('userdata',JSON.stringify(userdata));
              $ionicLoading.show({
                  template: "修改成功",
                  noBackdrop: 'true',
                });
                $timeout(function() {
                  $ionicLoading.hide();
                  history.go(-2);
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
          localStorage.setItem('city',name);
          localStorage.setItem('cityId',id);
          if(localStorage.getItem("visited")){
            $scope.visitedCity = JSON.parse(localStorage.getItem("visited"));
          }else{
            $scope.visitedCity = [];
          }
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
          history.go(-2);
        }
      }
});
