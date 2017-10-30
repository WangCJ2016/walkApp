angular.module('take_partController', [])
    .controller('take_partCtrl',function($scope,ApiService,ionicDatePicker,$filter,$cordovaImagePicker, $state, $ionicLoading, $timeout,$ionicPopup){
      var userdata = JSON.parse(localStorage.getItem('userdata'));
      //类型
      $scope.goback = function(){
        sessionStorage.setItem('order',2);
        history.go(-1);
      }
      $scope.typeList = [];
      $scope.index = 11;
      ApiService.typeList({type:2}).success(function(res){
        console.log(res);
        if(res.success){
          $scope.typeList = res.dataObject;
        }
      })
      $scope.chooseType = function(index,id){
        $scope.i = index;
        $scope.index = 0;
        $scope.hasmore = true;
        $scope.pageNo = 1;
        $scope.typeId = id;
        $scope.circlelist = [];
        loadajax($scope.pageNo,$scope.typeId);
      }
      $scope.hasmore = true;
      $scope.pageNo = 1;
      $scope.circlelist = [];
      $scope.typeId = 11;
      loadajax($scope.pageNo,$scope.typeId);
      $scope.loadMore = function () {
        $scope.pageNo ++;
        loadajax($scope.pageNo,$scope.typeId);
      }
      function loadajax(pageNo,typeId){
        ApiService.CircleList({
          userId:userdata.userId,
          appTypeId:typeId,
          pageNo:pageNo,
          pageSize:10
        }).success(function(res){
          console.log(res);
          if(res.dataObject.result.length == 0){
            $scope.hasmore = false;
            return;
          }else{
            for(var i=0;i<res.dataObject.result.length;i++){
              $scope.circlelist.push(res.dataObject.result[i]);
            }
            console.log($scope.circlelist);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      }
      //跳转圈子详情页
      $scope.tocircledetail = function(id,isJoin){
        $state.go('activity_detail',{
          index:id,
          isJoin:isJoin
        })
      }
      //申请加入圈子
      $scope.Joincircle = function(id,isJoin,index,$event,userId){
        $event.stopPropagation();
        if(isJoin==1){
          if(userId == userdata.userId){
            var myPopup = $ionicPopup.show({
               title: '您是圈主，确认解散圈子？',
               //scope: $scope,
               buttons: [
                 { text: '取消' },
                 {
                   text: '<b>确定</b>',
                   type: 'button-positive',
                   onTap: function(e) {
                     ApiService.exitCircle({
                       userId:userdata.userId,
                       token:userdata.token,
                       id:circleId
                     }).success(function(res){
                       console.log(res);
                       if(res.success){
                         $ionicLoading.show({
                           template: "退出成功",
                           noBackdrop: 'true',
                         });
                         $timeout(function() {
                           $ionicLoading.hide();
                          $scope.circlelist.splice(index,1);
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
                 },
               ]
             });
          }else{
            ApiService.exitCircle({
              userId:userdata.userId,
              token:userdata.token,
              id:circleId
            }).success(function(res){
              console.log(res);
              if(res.success){
                $ionicLoading.show({
                  template: "退出成功",
                  noBackdrop: 'true',
                });
                $timeout(function() {
                  $ionicLoading.hide();
                }, 2000);
                $scope.circlelist[index].isJoin = 0;
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
        }else{
          ApiService.addCircle({
            userId:userdata.userId,
            token:userdata.token,
            id:id
          }).success(function(res){
            console.log(res);
            if(res.success){
              $ionicLoading.show({
                template: "加入成功",
                noBackdrop: 'true',
              });
              $timeout(function() {
                $ionicLoading.hide();
              }, 2000);
              $scope.circlelist[index].isJoin = 1;
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
      //去详情页
      $scope.toactivedetail = function(id){
        $state.go('activity_detail',{
          index:id
        })
      }

});
