angular.module('loginController', [])
    .controller('loginCtrl',function($scope,ApiService,$ionicPopup,$ionicBackdrop,$state,$timeout,$ionicLoading){
      $scope.sendData = {
    		userName:'',
        password:''
    }
    $scope.register = function(){
      $state.go('register');
      sessionStorage.setItem('state',1);
    }
    //验证用户名必须为手机号
    var userNameReg = /^1[3|4|5|8][0-9]\d{4,8}$/;
    $scope.checkTel = function(){
      if(userNameReg.test($scope.sendData.userName)){
        return true;
      }else{
        $ionicLoading.show({
          template: "请输入正确的用户名",
          noBackdrop: 'true',
        });
        $timeout(function() {
          $ionicLoading.hide();
        }, 2000);
        return false;
      }
    }
      $scope.login = function(){
        if($scope.checkTel()){
          ApiService.login($scope.sendData).success(function(res){
                console.log(res);
                if(res.success){
                  var sex = '';
                  var photo = '';
                  if(res.dataObject.sex==1){
                    sex ='男';
                  }else{
                    sex ='女';
                  }
                  var userdata = {
                    userId:res.dataObject.id,
                    userName:res.dataObject.userName,
                    token:res.dataObject.token,
                    nickname:res.dataObject.nickname,
                    photo:res.dataObject.photo,
                    sex:sex,
                    city:res.dataObject.cityName,
                    status:res.dataObject.status
                  }
                  localStorage.setItem('userdata',JSON.stringify(userdata));
                  var myPopup = $ionicPopup.show({
                          title: '登录成功'
                      });
                      $ionicBackdrop.release();
                      $timeout(function() {
                        myPopup.close();
                        $state.go('tab.mine');

                      }, 2000);
                }else{
                  var myPopup = $ionicPopup.show({
                        title: '用户名密码错误'
                    });
                    $ionicBackdrop.release();
                    $timeout(function() {
                        myPopup.close();
                    }, 2000);
                }
          });
        }
      }
});
