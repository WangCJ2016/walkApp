angular.module('privateChatController', [])
    .controller('privateChatCtrl',function($scope,$ionicBackdrop,ApiService,$stateParams,$ionicLoading,$state,$ionicPopup){

        $scope.user = JSON.parse(localStorage.getItem('userdata'));
        $scope.userid = $scope.user.userId;
        $scope.receiveId = $stateParams.id;
        $scope.goback = function(){
          history.go(-1);
        }

        $scope.chat = [];
        function loadajax(){
            ApiService.chatDetail({
                userId:$scope.userid,
                receiveId:$scope.receiveId,
            }).success(function(res){
              console.log(res);
                $scope.chats = res.dataObject;
            })
        }
      	loadajax();
        $scope.send = [];
        $scope.sendChat = function(message){
             ApiService.sendChat({
                userId:$scope.userid,
                receiveId:$scope.receiveId,
                token:$scope.user.token,
                message:encodeURI(message,'UTF-8')
            }).success(function(res){
                if(res.success ){
                    $scope.send.push(message);
                    $scope.message = '';
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
                };
            })
        }
});
