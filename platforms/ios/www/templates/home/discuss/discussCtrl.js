angular.module('discussController', [])
    .controller('discussCtrl',function($scope,ApiService,$ionicLoading,$state,$timeout,$ionicViewSwitcher,$stateParams,$ionicPopup){
      sessionStorage.removeItem('star');
      var userdata = JSON.parse(localStorage.getItem('userdata'));
      $scope.ratingVal = 0;
      $scope.comment = {
        content:''
      }
      //验证星级和评论内容
      function checkstar(){
        if(!sessionStorage.getItem('star')){
          $ionicLoading.show({
              template: "请选择星星哦",
              noBackdrop: 'true',
            });
            $timeout(function() {
              $ionicLoading.hide();
            }, 2000);
          return false;
        }else{
          return true;
        }
      }
      function checkcomment(){
        if($scope.comment.content==''){
          $ionicLoading.show({
              template: "请输入评论内容",
              noBackdrop: 'true',
            });
            $timeout(function() {
              $ionicLoading.hide();
            }, 2000);
          return false;
        }else{
          return true;
        }
      }
      $scope.submitdiscuss = function(){
        if(checkstar() && checkcomment()){
          ApiService.addEcologySiteComment({
            userId:userdata.userId,
            token:userdata.token,
            id:$stateParams.id,
            star:sessionStorage.getItem('star'),
            contents:encodeURI($scope.comment.content,'UTF-8')
          }).success(function(res){
            console.log(res);
              if(res.success){
                $ionicLoading.show({
                    template: "评论成功",
                    noBackdrop: 'true',
                  });
                  $timeout(function() {
                    $ionicLoading.hide();
                    history.go(-1);
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
                    history.go(-1);
                  }, 2000);
                }
              }
          })
        }
      }
});
