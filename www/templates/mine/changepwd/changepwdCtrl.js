angular.module('changepwdController', [])
    .controller('changepwdCtrl',function($scope,ApiService,$state,$ionicViewSwitcher,$stateParams,$ionicPopup,$timeout,$ionicLoading){
      var userdata = JSON.parse(localStorage.getItem('userdata'));
      $scope.sendData = {
        userId:userdata.userId,
        token:userdata.token,
        oldPassword:'',
        newPassword:'',
        queren:''
      }
      $scope.changpwdBtn = function(){
         if($scope.sendData.newPassword == $scope.sendData.queren){
            ApiService.changepwd($scope.sendData).success(function(res){
              if(res.success){
                $ionicLoading.show({
                  template: "修改成功",
                  noBackdrop: 'true',
                });
                $timeout(function() {
                  $ionicLoading.hide();
                  $state.go('tab.mine');
                }, 2000);
              }else{
                if(res.msgCode){
                  var myPopup = $ionicPopup.show({
                     title: '您的账号在另一设备登录,请重新登录并修改密码',
                     //scope: $scope,
                     buttons: [
                       {
                         text: '<b>确定</b>',
                         type: 'button-positive',
                         onTap: function(e) {
                           localStorage.removeItem('userdata');
                           $state.go('login');
                         }
                       },
                     ]
                   });
                }else{
                  $ionicLoading.show({
                    template: "系统异常，请稍后重试",
                    noBackdrop: 'true',
                  });
                  $timeout(function() {
                    $ionicLoading.hide();
                  }, 2000);
                }
              }
          });
        }else{
            $ionicLoading.show({
              template: "两次密码不一致",
              noBackdrop: 'true',
            });
            $timeout(function() {
              $ionicLoading.hide();
            }, 2000);
        }

      }

});
