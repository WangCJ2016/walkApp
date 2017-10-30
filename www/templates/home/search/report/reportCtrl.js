angular.module('reportController', [])
    .controller('reportCtrl',function($scope,ApiService,$ionicLoading,$timeout,$stateParams,$state){
      var userdata = JSON.parse(localStorage.getItem('userdata'));
      $scope.i = -1;
      $scope.reportCont =['广告或垃圾信息','色情低俗内容','疑似抄袭','与事实不符','标题夸张'];
      $scope.reportClick = function(index){
        $scope.i = index;
      }
      $scope.lastClick = function(){
        $scope.i = -1;
      }
      $scope.content = {cont:''};
      $scope.completeClick = function(){
        console.log($scope.content.cont);
        if(localStorage.getItem('userdata')){
          if($scope.i == -1){
            if($scope.content.cont == ''){
              $ionicLoading.show({
                  template: "请输入举报内容",
                  noBackdrop: 'true',
                });
                $timeout(function() {
                  $ionicLoading.hide();
                }, 2000);
            }else{
              ApiService.addEcologySiteReport({
                userId:userdata.userId,
                token:userdata.token,
                id:$stateParams.id,
                contents:encodeURI($scope.content.cont,'UTF-8')
              }).success(function(res){
                if(res.success){
                  $ionicLoading.show({
                      template: "举报成功",
                      noBackdrop: 'true',
                    });
                    $timeout(function() {
                      $ionicLoading.hide();
                      history.go(-1);
                    }, 2000);
                }
              })
            }
          }else{
            ApiService.addEcologySiteReport({
              userId:userdata.userId,
              token:userdata.token,
              id:$stateParams.id,
              contents:encodeURI($scope.reportCont[$scope.i],'UTF-8')
            }).success(function(res){
              console.log(res);
              if(res.success){
                $ionicLoading.show({
                    template: "举报成功",
                    noBackdrop: 'true',
                  });
                  $timeout(function() {
                    $ionicLoading.hide();
                    history.go(-1);
                  }, 2000);
              }
            })
          }
        }else{
          $state.go('login');
        }
      }
});
