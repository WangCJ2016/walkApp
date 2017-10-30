angular.module('site_searchController', [])
    .controller('site_searchCtrl',function($scope,$ionicBackdrop,ApiService,$stateParams,$state,$ionicViewSwitcher){
      $scope.site_type = [];
      $scope.checkedList = [];
      ApiService.typeList({
        type:1
      }).success(function(res){
        console.log(res);
        if(res.success){
          for(var i = 0; i<res.dataObject.length;i++){
              $scope.site_type.push(res.dataObject[i]);
              $scope.site_type[i].checked = false;
          }
        }
      });
    $scope.checkClick = function(index,ischecked,id){
      if(ischecked == false){
        $scope.site_type[index].checked = true;
        $scope.checkedList.push($scope.site_type[index]);
      }else{
        $scope.site_type[index].checked = false;
        for(var i = 0;i < $scope.checkedList.length;i++){
          if($scope.checkedList[i].id == id){
            $scope.checkedList.splice(i,1);
          }
        }
      }
    }
});
