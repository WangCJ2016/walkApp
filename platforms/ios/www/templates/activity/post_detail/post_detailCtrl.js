angular.module('post_detailController', [])
    .controller('post_detailCtrl',function($scope,ApiService,$cordovaGeolocation,$state,$ionicViewSwitcher,$stateParams,$ionicLoading,$timeout,$ionicPopup){
      var userdata = JSON.parse(localStorage.getItem('userdata'));
      $scope.siteDateil = {};
      ApiService.detailEcologyCirclePost({
        id:$stateParams.index,
        lng:sessionStorage.getItem('lng'),
        lat:sessionStorage.getItem('lat')
      }).success(function(res){
        console.log(res);
        if(res.success){
          $scope.siteDateil = res.dataObject;
          $scope.siteDateil.pics = res.dataObject.pictures.split(',');
          var pics = res.dataObject.pictures.split(',');
          if(pics[pics.length-1] == ''){
            pics.splice(pics.length - 1,1);
            $scope.siteDateil.pics = pics;
          }else{
            $scope.siteDateil.pics = pics;
          }
          if($scope.siteDateil.siteList.length>0){
            for(var i = 0; i < $scope.siteDateil.siteList.length; i++){
              $scope.siteDateil.siteList[i].typeArr = $scope.siteDateil.siteList[i].appTypeNames.split(',');
              $scope.siteDateil.siteList[i].typeArr.splice($scope.siteDateil.siteList[i].typeArr.length-1,1);
            }
          }
        }
      })
      // 评论列表
      $scope.hasmore = true;
      $scope.pageNo = 1;
      $scope.siteCommentlist = [];
      $scope.loadMore = function () {
        $scope.pageNo ++;
        loadajax($scope.pageNo);
      }
      loadajax($scope.pageNo);
      function loadajax(pageNo) {
        ApiService.ecologyCirclePostCommentList({
          pageNo:pageNo,
          pageSize:5,
          id:$stateParams.index
        }).success(function(res){
          console.log(res);
          if(res.dataObject.result.length == 0){
            $scope.hasmore = false;
            return;
          }else{
            for(var i=0;i<res.dataObject.result.length;i++){
              $scope.siteCommentlist.push(res.dataObject.result[i]);
            }
            console.log($scope.siteCommentlist);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      }
      $scope.addDiscuss = {
        cont:''
      }
      var date = new Date();
      //添加评论
      $scope.issueDiscuss = function(){
        // console.log($scope.addDiscuss.cont);
        if($scope.addDiscuss.cont == ''){
          $ionicLoading.show({
              template: "请输入评论内容",
              noBackdrop: 'true',
            });
            $timeout(function() {
              $ionicLoading.hide();
            }, 2000);
        }else{
          ApiService.addEcologyCirclePostComment({
            userId:userdata.userId,
            token:userdata.token,
            parentId:$stateParams.index,
            contents:encodeURI($scope.addDiscuss.cont,'UTF-8')
          }).success(function(res){
            if(res.success){
              $ionicLoading.show({
                  template: "评论成功",
                  noBackdrop: 'true',
                });
                $timeout(function() {
                  $ionicLoading.hide();
                }, 2000);
                $scope.addDiscuss.cont = '';
              $scope.siteCommentlist.unshift({
                contents:$scope.addDiscuss.cont,
                userNickname:userdata.nickname,
                userPhoto:userdata.photo,
                createTime:date.getFullYear() + '-' + date.getMonth() + '-'+date.getDate()
              })
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
      //跳去修改页面
      $scope.goupdataPost = function(id) {
        if(localStorage.getItem('userdata')){
          var data = JSON.parse(localStorage.getItem('userdata'));
          if(data.userId == id){
            $state.go('issue_post',{
              postid:$stateParams.index
            })
          }else{
            $ionicLoading.show({
                template: "您不是发布者哦",
                noBackdrop: 'true',
              });
              $timeout(function() {
                $ionicLoading.hide();
              }, 2000);
          }
        }else{
          $state.go('login');
        }
      };
      //去私聊
      $scope.go = function(item){
        if(localStorage.getItem('userdata')){
          $state.go('privateChat',{
              id:item
          })
        }else{
          $state.go('login');
        }
      }
      //跳转详情页
      $scope.todetail = function(id,star){
        $state.go('detail',{
          index:id,
          star:star
        })
      };
      // 放大图片
      $scope.big_pics = '';
      $scope.pic_index = 0;
      $scope.big_pic_fun = function(pics , pic){
        $scope.big_pics = pics;
        $scope.big_pic = pic;
        for(var i=0; i<pics.length ; i++){
          if ( pics[i] == pic ) {
            $scope.pic_index = i;
          };
        }
      }
      // 下一张图片
      $scope.next_pic = function(i,pics){
        i++;
        if ( i < pics.length) {
            $scope.pic_index = i;
            $scope.big_pic = pics[$scope.pic_index];
        }else{
            $scope.pic_index = 0;
            $scope.big_pic = pics[0];
        }
      }
      // 上一张图片
      $scope.prev_pic = function(i,pics){
        i--;
        if ( i < 0 ) {
            $scope.pic_index = pics.length-1;
            $scope.big_pic = pics[$scope.pic_index];
        }else{
            $scope.pic_index = i;
            $scope.big_pic = pics[i];
        }
      }
      // 隐藏大图
      $scope.pic_hide = function(){
        $scope.big_pics = '';
      }
});
