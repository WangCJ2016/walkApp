angular.module('issue_historyController', [])
    .controller('issue_historyCtrl',function($scope,$ionicBackdrop,ApiService,$stateParams,$state){
      //用户信息
      var userdata = JSON.parse(localStorage.getItem('userdata'));
      //获取列表接口
      $scope.typeArr = ['生态产品','生态玩点','活动'];
      $scope.farmshow = true;
      $scope.editshow = true;
      $scope.i = 4;

      $scope.hasmore = true;
      $scope.pageNo = 0;
      $scope.dataArr = [];
      $scope.loadMore = function () {
        $scope.pageNo ++;
        loadajax($scope.pageNo);
      }
      function loadajax(pageNo) {
        ApiService.userIdfarmList({
          userId:userdata.userId,
          pageNo:pageNo,
          pageSize:6
        }).success(function(res){
          console.log(res);
          sessionStorage.setItem('typename','生态农庄');
          if(res.dataObject.farmList.result.length == 0){
            $scope.hasmore = false;
            return;
          }else{
            for(var i=0;i<res.dataObject.farmList.result.length;i++){
              $scope.dataArr.push(res.dataObject.farmList.result[i]);
            }
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      }
      //进入页面初始化
      $scope.fram = function(){
        $scope.farmshow = true;
        $scope.editshow = true;
        $scope.i = 4;
        $scope.hasmore = true;
        $scope.dataArr = [];
        $scope.pageNo = 1;
        loadfarm($scope.pageNo);
        sessionStorage.setItem('typename','生态农庄');
        $scope.loadMore = function () {
          $scope.pageNo ++;
          loadfarm($scope.pageNo);
        }
        function loadfarm(pageNo) {
          ApiService.userIdfarmList({
            userId:userdata.userId,
            pageNo:pageNo,
            pageSize:6
          }).success(function(res){
            console.log(res);
            if(res.dataObject.farmList.result.length == 0){
              $scope.hasmore = false;
              return;
            }else{
              for(var i=0;i<res.dataObject.farmList.result.length;i++){
                $scope.dataArr.push(res.dataObject.farmList.result[i]);
              }
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
          })
        }
      }
      $scope.typeclick = function(index){
        $scope.farmshow = false;
        $scope.i = index;
        $scope.hasmore = true;
        $scope.dataArr = [];
        $scope.pageNo = 1;
         if(index == 0){
          $scope.editshow = true;
          sessionStorage.setItem('typename','生态产品');
          loadfarm($scope.pageNo);
          $scope.loadMore = function () {
            $scope.pageNo ++;
            loadfarm($scope.pageNo);
          }
          function loadfarm(pageNo) {
            ApiService.userIdproductList({
              userId:userdata.userId,
              pageNo:pageNo,
              pageSize:6
            }).success(function(res){
              console.log(res);
              if(res.dataObject.productList.result.length == 0){
                $scope.hasmore = false;
                return;
              }else{
                for(var i=0;i<res.dataObject.productList.result.length;i++){
                  $scope.dataArr.push(res.dataObject.productList.result[i]);
                }
              }
              $scope.$broadcast('scroll.infiniteScrollComplete');
            })
          }
        }else if(index == 1){
          $scope.editshow = true;
          sessionStorage.setItem('typename','生态玩点');
          loadfarm($scope.pageNo);
          $scope.loadMore = function () {
            $scope.pageNo ++;
            loadfarm($scope.pageNo);
          }
          function loadfarm(pageNo) {
            ApiService.userIdplaypointList({
              userId:userdata.userId,
              pageNo:pageNo,
              pageSize:6
            }).success(function(res){
              console.log(res);
              if(res.dataObject.playpointList.result.length == 0){
                $scope.hasmore = false;
                return;
              }else{
                for(var i=0;i<res.dataObject.playpointList.result.length;i++){
                  $scope.dataArr.push(res.dataObject.playpointList.result[i]);
                }
              }
              $scope.$broadcast('scroll.infiniteScrollComplete');
            })
          }
        }else{
          $scope.editshow = false;
          sessionStorage.setItem('typename','活动');
          loadfarm($scope.pageNo);
          $scope.loadMore = function () {
            $scope.pageNo ++;
            loadfarm($scope.pageNo);
          }
          function loadfarm(pageNo) {
            ApiService.eventList({
              userId:userdata.userId,
              pageNo:pageNo,
              pageSize:6
            }).success(function(res){
              console.log(res);
              if(res.dataObject.eventList.result.length == 0){
                $scope.hasmore = false;
                return;
              }else{
                for(var i=0;i<res.dataObject.eventList.result.length;i++){
                  $scope.dataArr.push(res.dataObject.eventList.result[i]);
                }
              }
              $scope.$broadcast('scroll.infiniteScrollComplete');
            })
          }
        }
      }
      $scope.todetail = function(id){
         if($scope.i == 2){
           $state.go('activity_detail',{
             index:id
           })
         }else{
           $state.go('detail',{
             index:id
           })
         }
      }
      //修改
      $scope.edit = function(index,$event,id,phone,name){
        $event.stopPropagation();
        $state.go('edit',{
          id:id,
          phone:phone,
          name:name
        })
      }
      //删除
      $scope.delete = function(index,$event,id){
        $event.stopPropagation();
        console.log(index);
        if($scope.i == 4){
          ApiService.updateFarm({
            userId:userdata.userId,
            token:userdata.token,
            id:id,
            address:'',
            phone:'',
            isDelete:1
          }).success(function(res){
            console.log(res);
            if(res.success){
              $scope.dataArr.splice(index,1);
            }
          })
        }else if($scope.i == 0){
          ApiService.updateProduct({
            userId:userdata.userId,
            token:userdata.token,
            id:id,
            address:'',
            phone:'',
            isDelete:1
          }).success(function(res){
            console.log(res);
            if(res.success){
              $scope.dataArr.splice(index,1);
            }
          })
        }else if($scope.i == 1){
          ApiService.updatePlaypoint({
            userId:userdata.userId,
            token:userdata.token,
            id:id,
            address:'',
            phone:'',
            isDelete:1
          }).success(function(res){
            console.log(res);
            if(res.success){
              $scope.dataArr.splice(index,1);
            }
          })
        }else{
          ApiService.updateEvent({
            userId:userdata.userId,
            token:userdata.token,
            id:id,
            address:'',
            phone:'',
            isDelete:1
          }).success(function(res){
            console.log(res);
            if(res.success){
              $scope.dataArr.splice(index,1);
            }
          })
        }
      }
});
