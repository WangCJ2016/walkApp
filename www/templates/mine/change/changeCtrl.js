angular.module('changeController', [])
    .controller('changeCtrl',function($scope,ApiService,$ionicLoading,$state,$ionicViewSwitcher,$stateParams,$timeout,$ionicPopup){
      var userdata = JSON.parse(localStorage.getItem('userdata'));
      $scope.nowdata = {
        username:userdata.nickname,
        sex:userdata.sex
      };
      $scope.sendData ={
        userId:userdata.userId,
        token:userdata.token,
        nickname:'',
        sex:''
      }
      $scope.sexs = ['男','女'];
      userdata.sex == '男' ? $scope.sexIndex = 0 : $scope.sexIndex = 1;
      $scope.checkSex = function(index){
        $scope.sexIndex = index;
      }
      $scope.changeSex = function(){
          ApiService.changedata({
              userId:userdata.userId,
              token:userdata.token,
              sex: $scope.sexIndex + 1
          }).success(function(res) {
            if(res.success){
              $scope.sexIndex == 0 ? userdata.sex = '男' : userdata.sex = '女';
              $ionicLoading.show({
                  template: "性别更换成功",
                  noBackdrop: 'true',
                });
                $timeout(function() {
                  localStorage.setItem('userdata',JSON.stringify(userdata));
                  history.go(-1);
                  $ionicLoading.hide();
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
          })
      }
      var checkName = function(){
        if($scope.nowdata.username != ''){
          if($scope.nowdata.username.length > 10){
              $ionicLoading.show({
                  template: "昵称不能超过10个字",
                  noBackdrop: 'true',
                });
                $timeout(function() {
                  $ionicLoading.hide();
                }, 2000);
              return false;
          }else{
            return true;
          }
        }else{
          $ionicLoading.show({
              template: "昵称不能为空",
              noBackdrop: 'true',
            });
            $timeout(function() {
              $ionicLoading.hide();
            }, 2000);
              return false;
        }
      }
      $scope.changeName = function(){
        // console.log($scope.nowdata.username);
        if(checkName()){
          ApiService.changedata({
              userId:userdata.userId,
              token:userdata.token,
              nickname: encodeURI($scope.nowdata.username,'UTF-8')
          }).success(function(res) {
            if(res.success){
              userdata.nickname = $scope.nowdata.username;
              $ionicLoading.show({
                  template: "昵称修改成功",
                  noBackdrop: 'true',
                });
                $timeout(function() {
                  localStorage.setItem('userdata',JSON.stringify(userdata));
                  history.go(-1);
                  $ionicLoading.hide();
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
          })
        }
      }
});
