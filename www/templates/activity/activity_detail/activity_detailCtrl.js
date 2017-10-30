angular.module('activity_detailController', [])
    .controller('activity_detailCtrl',function($scope,ApiService,$ionicPopup,$ionicBackdrop,$state,$timeout,$stateParams,$ionicLoading){
      $scope.goback = function(){
        sessionStorage.setItem('order',2);
        history.go(-1);
      }
      var data = JSON.parse(localStorage.getItem('userdata'));
      var circleId = $stateParams.index;
      $scope.isJoin = $stateParams.isJoin;
      //圈子详情
      ApiService.detailCircle({
        id:circleId
      }).success(function(res){
        console.log(res);
        $scope.circledata = res.dataObject;
      })
      //圈子下的帖子列表
      $scope.hasmore = true;
      $scope.pageNo = 1;
      $scope.postlist = [];
      $scope.loadMore = function () {
        $scope.pageNo ++;
        loadajax($scope.pageNo);
      }
      loadajax($scope.pageNo);
      function loadajax(pageNo) {
        ApiService.postList({
          pageNo:pageNo,
          pageSize:5,
          parentId:circleId
        }).success(function(res){
          console.log(res);
          if(res.dataObject.result.length == 0){
            $scope.hasmore = false;
            return;
          }else{
            for(var i=0;i<res.dataObject.result.length;i++){
              $scope.postlist.push(res.dataObject.result[i]);
              $scope.postlist[$scope.postlist.length - 1].pics = res.dataObject.result[i].pictures.split(',');
              //var pics = res.dataObject.result[i].
              var pics = res.dataObject.result[i].pictures.split(',');
              if(pics[pics.length-1] == ''){
                pics.splice(pics.length - 1,1);
                $scope.postlist[$scope.postlist.length - 1].pics = pics;
              }else{
                $scope.postlist[$scope.postlist.length - 1].pics = pics;
              }var pics = res.dataObject.result[i].pictures.split(',');;
              if(pics[pics.length-1] == ''){
                pics.splice(pics.length - 1,1);
                $scope.postlist[$scope.postlist.length - 1].pics = pics;
              }else{
                $scope.postlist[$scope.postlist.length - 1].pics = pics;
              }
            }
            console.log($scope.postlist);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      }
      //去发帖
      $scope.gopost = function(id){
        if($scope.isJoin == 1){
          $state.go('issue_post',{
            id:id
          })
        }else{
          $ionicLoading.show({
            template: "先加圈才能发帖哦",
            noBackdrop: 'true',
          });
          $timeout(function() {
            $ionicLoading.hide();
          }, 2000);
        }
      }
      //申请加入圈子
      $scope.Joincircle = function(userId){
        if($scope.isJoin == 1){
          if(userId == data.userId){
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
                       userId:data.userId,
                       token:data.token,
                       id:circleId
                     }).success(function(res){
                       console.log(res);
                       if(res.success){
                         $ionicLoading.show({
                           template: "解散成功",
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
                 },
               ]
             });
          }else{
            ApiService.exitCircle({
              userId:data.userId,
              token:data.token,
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
                $scope.isJoin = 0;
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
            userId:data.userId,
            token:data.token,
            id:circleId
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
              $scope.isJoin = 1;
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
      //跳转帖子详情页
      $scope.topostdetail = function(id){
        $state.go('post_detail',{
          index:id
        })
      }
});
