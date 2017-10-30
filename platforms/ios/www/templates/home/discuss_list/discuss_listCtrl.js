angular.module('discuss_listController', [])
    .controller('discuss_listCtrl',function($scope,$ionicBackdrop,ApiService,$stateParams,$state,$timeout,$filter,$ionicViewSwitcher){
      //帖子列表
      $scope.hasmore = true;
      $scope.pageNo = 1;
      $scope.discusslist = [];
      $scope.loadMore = function () {
        $scope.pageNo ++;
        loadajax($scope.pageNo);
      }
      loadajax($scope.pageNo);
      function loadajax(pageNo) {
        ApiService.ecologySiteCommentList({
          pageNo:pageNo,
          pageSize:10,
          id:$stateParams.id
        }).success(function(res){
          console.log(res);
          if(res.dataObject.result.length == 0){
            $scope.hasmore = false;
            return;
          }else{
            for(var i=0;i<res.dataObject.result.length;i++){
              $scope.discusslist.push(res.dataObject.result[i]);
            }
            console.log($scope.discusslist);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      }
      //去评论
      $scope.godiscuss = function(){
        if(localStorage.getItem('userdata')){
          $state.go('discuss',{
            id:$stateParams.id
          })
        }else{
          $state.go('login');
        }
      }
});
