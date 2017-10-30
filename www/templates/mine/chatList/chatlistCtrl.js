angular.module('chatlistController', [])
    .controller('chatlistCtrl',function($scope,$ionicBackdrop,ApiService,$stateParams,$state){
        $scope.userdata = JSON.parse(localStorage.getItem('userdata'));
        // $scope.userdata.userId = 7;
        // 加载消息列表
        $scope.chats = [];
        function loadajax(){
            ApiService.chatList({
                userId:$scope.userdata.userId,
            }).success(function(res){
                   console.log(res);
                if ( res.success ) {
                    $scope.chats = res.dataObject;
                };
            })
        }
        loadajax();

        // 进入聊天界面
        $scope.go = function(item){
            if ( item.receiveId == $scope.userdata.userId) {
                $state.go('privateChat',{
                    id:item.sendId
                })
            }else{
                $state.go('privateChat',{
                    id:item.receiveId
                })
            }
        }
});
