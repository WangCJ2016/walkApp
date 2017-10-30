angular.module('mineController', [])
    .controller('mineCtrl',function($scope,ApiService,$cordovaGeolocation,$state,$ionicViewSwitcher,$ionicPopup,$ionicBackdrop,$timeout){
        $scope.isclick = false;
        if(localStorage.getItem('userdata')){
            $scope.userdata = JSON.parse(localStorage.getItem('userdata'));
            //console.log(  $scope.userdata);
              $scope.userpic = $scope.userdata.photo;
              $scope.btncont = '退出登录';
              $scope.username = $scope.userdata.nickname;
              $scope.minebtn = function(){
                localStorage.removeItem('userdata');
                $state.go('login');
              }
              $scope.mydatabtn = function(){
                $state.go('mydata');
                $ionicViewSwitcher.nextDirection("forward");
              }

              // 未读消息
              $scope.count  = 0;
              ApiService.chatCount({
                userId:$scope.userdata.userId
              }).success(function(res){
                console.log(res);
                if(res.success){
                  $scope.count = res.dataObject;
                }
              })
              //去我发起的页面
              $scope.goMineIssue = function(){
                $state.go('person_data',{
                  userId:$scope.userdata.userId
                });
                $ionicViewSwitcher.nextDirection("forward");
              }
        }else{
          $scope.userpic = 'img/mine/login/2.png';
          $scope.username = '';
          $scope.btncont = '登录';
          $scope.minebtn = function(){
            $state.go('login');
            $ionicViewSwitcher.nextDirection("forward");
          }
      }
        $scope.Version = function(){
          ApiService.Version({
            platform:2,
            version:1.01
          }).success(function(res){
            console.log(res);
            if(res.success){
              var myPopup = $ionicPopup.show({
                      title: '已经是最新版本'
                  });
                  $ionicBackdrop.release();
                  $timeout(function() {
                      myPopup.close();
                  }, 2000);
            }else{
            }
          })
        }
});
