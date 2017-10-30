angular.module('AboutpostController', [])
    .controller('AboutpostCtrl',function($scope,$ionicBackdrop,ApiService,$stateParams,$state,$timeout,$filter,$ionicViewSwitcher,$ionicLoading){
      //相关帖子
      $scope.postlist = [];
      ApiService.corrlateEcologyCirclePostList({
        id:$stateParams.index
      }).success(function(res){
        console.log(res);
        if(res.success){
          if(res.dataObject.length > 0){
            for(var i=0;i<res.dataObject.length;i++){
              $scope.postlist.push(res.dataObject[i]);
              var pics = res.dataObject[i].pictures.split(',');
              if(pics[pics.length-1] == ''){
                pics.splice(pics.length - 1,1);
                $scope.postlist[$scope.postlist.length - 1].pics = pics;
              }else{
                $scope.postlist[$scope.postlist.length - 1].pics = pics;
              }
            }
          }
        }
      });
      //跳转帖子详情页
      $scope.topostdetail = function(id){
        $state.go('post_detail',{
          index:id
        })
      }
});
