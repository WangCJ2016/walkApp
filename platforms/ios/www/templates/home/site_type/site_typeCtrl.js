angular.module('site_typeController', [])
    .controller('site_typeCtrl',function($scope,ApiService,$location,$ionicScrollDelegate,$timeout,$stateParams,$state,$ionicLoading){
      var userdata = JSON.parse(localStorage.getItem('userdata'));
        $scope.hasType = $stateParams.type.split(',');
        console.log($scope.hasType);
        $scope.site_type = [];
        $scope.types = ',';
        $scope.checkedList = [];
        //选择列表
        ApiService.typeList({
          type:1
        }).success(function(res){
          console.log(res);
          if(res.success){
            $scope.site_type = res.dataObject;
            for(var i = 0;i < $scope.site_type.length;i++){
              for(var j=0;j < $scope.hasType.length;j++){
                if($scope.site_type[i].name == $scope.hasType[j]){
                  $scope.site_type[i].checked = true;
                  $scope.types += $scope.site_type[i].id + ',';
                  break;
                }else{
                  $scope.site_type[i].checked = false;
                }
              }
            }
          }
        });
        $scope.checkClick = function(index,ischecked,id,name){
          if(ischecked == false){
            if($scope.checkedList.length + $scope.hasType.length >= 4){
              $ionicLoading.show({
                    template: "最多选择4个标签哦",
                    noBackdrop: 'true',
                  });
                  $timeout(function() {
                    $ionicLoading.hide();
                  }, 2000);
            }else{
              $scope.site_type[index].checked = true;
              $scope.checkedList.push($scope.site_type[index]);
            }
          }else{
            if($scope.hasType.indexOf(name) > -1){
              $ionicLoading.show({
                template: "已有标签不能修改",
                noBackdrop: 'true',
              });
              $timeout(function() {
                $ionicLoading.hide();
              }, 2000);
              // continue;
            }else{
              $scope.site_type[index].checked = false;
              for(var i = 0;i < $scope.checkedList.length;i++){
                if($scope.checkedList[i].id == id){
                  $scope.checkedList.splice(i,1);
                }
              }
            }
          }
        }
        $scope.complete = function(){
          if($scope.checkedList != ''){
            for(var i = 0;i < $scope.checkedList.length;i++){
              $scope.types += $scope.checkedList[i].id + ',';
            }
          }
          ApiService.updateEcologySite({
            userId:userdata.userId,
            token:userdata.token,
            appTypeIds:$scope.types,
            id:$stateParams.id
          }).success(function(res){
            console.log(res);
            if(res.success){
              $ionicLoading.show({
                template: "添加成功",
                noBackdrop: 'true',
              });
              $timeout(function() {
                $ionicLoading.hide();
                history.go(-1);
              }, 2000);
            }else{
              $ionicLoading.show({
                template: "添加失败，请稍后重试",
                noBackdrop: 'true',
              });
              $timeout(function() {
                $ionicLoading.hide();
              }, 2000);
            }
          })
        }
});
