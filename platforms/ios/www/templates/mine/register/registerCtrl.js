angular.module('registerController', [])
    .controller('registerCtrl',function($scope,ApiService,$ionicPopup,$ionicBackdrop,$timeout,$state,$stateParams){
      $scope.gaincode = false;
      $scope.sendData = {
        nickname:'',
    		userName:'',
        code:''
    }
      $scope.getVerifyCode = function(){
        if($scope.sendData.userName == ''){
          var myPopup = $ionicPopup.show({
                title: '请输入手机号'
            });
            $ionicBackdrop.release();
            $timeout(function() {
                myPopup.close();
            }, 2000);
        }else{
          $scope.gaincode = true;
          $scope.num = 60;
          var timer = setInterval(function(){
              $scope.num--;
              if($scope.num == 0){
                clearInterval(timer);
                $scope.gaincode = false;
              }
              $scope.$apply(function(){
      					$scope.num;
      				})
            },1000);
          ApiService.getRegSign().success(function(res){
            console.log(res);
            if(res.success){
              ApiService.code({
                userName:$scope.sendData.userName,
                token:res.dataObject
              }).success(function(data){
                console.log(data);
                if(data.success){
                  $scope.next = function(){
                    if(data.dataObject == $scope.sendData.code){
                        $state.go('register_complete',{
                          tel:$scope.sendData.userName,
                          code:data.dataObject
                        });
                    }else{
                      var myPopup = $ionicPopup.show({
                            title: '验证码输入错误'
                        });
                        $ionicBackdrop.release();
                        $timeout(function() {
                            myPopup.close();
                        }, 2000);
                    }
                  }
                }else{
                  $scope.gaincode = false;
                  clearInterval(timer);
                  var myPopup = $ionicPopup.show({
                        title: '该手机号已经注册过'
                    });
                    $ionicBackdrop.release();
                    $timeout(function() {
                        myPopup.close();
                    }, 2000);
                }
              });
            }
          })
        }
      }

      $scope.sendpwd = {
        nickname:'',
        userName:$stateParams.tel,
        password:'',
        code:$stateParams.code,
        queren:'',

    }
    //验证昵称
    var checkusername = function(){
      if($scope.sendData.nickname == ''){
        var myPopup = $ionicPopup.show({
              title: '请输入昵称'
          });
          $ionicBackdrop.release();
          $timeout(function() {
              myPopup.close();
          }, 2000);
          return false;
      }else{
        $scope.sendpwd.nickname = encodeURI($scope.sendData.nickname,'UTF-8');
        return true;
      }
    }
    //验证密码
    var checkpwd = function(){
      if($scope.sendpwd.password == ''){
        var myPopup = $ionicPopup.show({
              title: '请输入密码'
          });
          $ionicBackdrop.release();
          $timeout(function() {
              myPopup.close();
          }, 2000);
          return false;
      }else{
        return true;
      }
    }
      $scope.reg = function(){
        if(checkusername()&&checkpwd()){
          console.log($scope.sendpwd);
          if($scope.sendpwd.password == $scope.sendpwd.queren){
            ApiService.regsiter($scope.sendpwd).success(function(res){
              console.log(res);
              if(res.success){
                var myPopup = $ionicPopup.show({
                        title: '注册成功'
                    });
                    $ionicBackdrop.release();
                    $timeout(function() {
                        myPopup.close();
                        $state.go('login');
                    }, 2000);

              }else{
                var myPopup = $ionicPopup.show({
                      title: '注册失败'
                  });
                  $ionicBackdrop.release();
                  $timeout(function() {
                      myPopup.close();
                  }, 2000);
              }
            });
          }else{
            var myPopup = $ionicPopup.show({
                  title: '两次密码不一致'
              });
              $ionicBackdrop.release();
              $timeout(function() {
                  myPopup.close();
              }, 2000);
          }
        }
      }
});
