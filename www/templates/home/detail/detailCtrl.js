angular.module('detailController', [])
    .controller('detailCtrl',function(XZIp,$scope,ApiService,$ionicLoading,$ionicBackdrop,$state,$timeout,$stateParams,$location,$ionicPopup,$ionicScrollDelegate){
      $scope.scrollTops = 0;
      $scope.swipe = function(){
        $scope.scrollTops = $ionicScrollDelegate.getScrollPosition().top;
        if($scope.scrollTops <= 150){
           angular.element(document.querySelector('#fixed'))[0].style.opacity = $scope.scrollTops * 0.010;
           $scope.$apply(function() {
             $scope.scrollTops;
           })
        }
       };
      $scope.goback = function($event){
        $event.stopPropagation();
        if(sessionStorage.getItem('go')){
          $state.go('tab.home');
          sessionStorage.removeItem('go');
        }else{
          history.go(-1);
        }
      }
      var marker, map = new AMap.Map("maps", {
         resizeEnable: true,
         //center: [116.397428, 39.90923],
         zoom: 13
     });
     $scope.nearBysiteList = [];
    //详情
    $scope.siteDate = {};
    $scope.rating = $stateParams.star;
    $scope.isMine = $stateParams.mine;
    ApiService.etailEcologySite({
      id:$stateParams.index
    }).success(function(res){
      if(res.success){
        $scope.siteDate = res.dataObject;
        console.log($scope.siteDate);
        $scope.siteDate.typeNames = res.dataObject.appTypeNames.split(' ');
        $scope.siteDate.typeNames.splice($scope.siteDate.typeNames.length - 1,1);
        //附近点推荐
        ApiService.ecologySiteList({
          pageNo:1,
          pageSize:3,
          siteId:$stateParams.index,
          lng:$scope.siteDate.lng,
          lat:$scope.siteDate.lat
        }).success(function(res){
          console.log(res);
          if(res.success){
            if(res.dataObject.result.length > 0){
              for(var i=0;i<res.dataObject.result.length;i++){
                $scope.nearBysiteList.push(res.dataObject.result[i]);
                var typeNames = res.dataObject.result[i].appTypeNames.split(' ');
                if(typeNames[typeNames.length-1] == ''){
                  typeNames.splice(typeNames.length - 1,1);
                  $scope.nearBysiteList[$scope.nearBysiteList.length - 1].typeNames = typeNames;
                }else{
                  $scope.hotlist[$scope.nearBysiteList.length - 1].typeNames = typeNames;
                }
                $scope.nearBysiteList[$scope.nearBysiteList.length - 1].pic = res.dataObject.result[i].pictures.split(',')[0];
              }
              //console.log($scope.nearBysiteList);
            }
          }
        })
        marker = new AMap.Marker({
            icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: [res.dataObject.lng, res.dataObject.lat]
        });
        marker.setMap(map);
        map.setFitView();
      }
    });
    //相关帖子
    $scope.circleList = [];
    ApiService.corrlateEcologyCirclePostList({
      id:$stateParams.index
    }).success(function(res){
      console.log(res);
      if(res.success){
        if(res.dataObject.length > 0){
          $scope.circleList.push(res.dataObject[0]);
          // $scope.circleList[0].pics = res.dataObject[0].pictures.split(',');
          //console.log($scope.circleList);
          var pics = res.dataObject[0].pictures.split(',');
          if(pics[pics.length-1] == ''){
            pics.splice(pics.length - 1,1);
            $scope.circleList[0].pics = pics;
          }else{
            $scope.circleList[0].pics = pics;
          }
        }
      }
    });
    //相关帖子页面
    $scope.goAboutPost = function(){
      $state.go('Aboutpost',{
        index:$stateParams.index
      });
    }
    //评论列表
    $scope.commentList = [];
    ApiService.ecologySiteCommentList({
      id:$stateParams.index,
      pageNo:1,
      pageSize:3
    }).success(function(res){
      if(res.success){
        $scope.commentList = res.dataObject.result;
      }
      console.log($scope.commentList);
    })
    //举报列表
    $scope.report = function(){
      $state.go('report',{
        id:$stateParams.index
      })
    }
    //去评论列表
    $scope.godiscuss_list = function(){
      $state.go('discuss_list',{
        id:$stateParams.index
      })
    }
    //更多图片
    $scope.tomorepic = function(){
      $state.go('morepic', {
        index:$stateParams.index
      });
    }
    //跳转地点详情页
    $scope.todetail = function(id,star){
      $state.go('detail',{
        index:id,
        star:star
      })
    }
    //跳去修改页面
    $scope.goupdata = function($event,id) {
      $event.stopPropagation();
      if(localStorage.getItem('userdata')){
        var data = JSON.parse(localStorage.getItem('userdata'));
        $state.go('say_some',{
          id:$stateParams.index
        })
      }else{
        $state.go('login');
      }

    };
    //删除按钮
    $scope.delete = function($event,id) {
      $event.stopPropagation();
      if(localStorage.getItem('userdata')){
        var data = JSON.parse(localStorage.getItem('userdata'));
          var myPopup = $ionicPopup.show({
             title: '是否删除地点',
             //scope: $scope,
             buttons: [
               { text: '取消' },
               {
                 text: '<b>确定</b>',
                 type: 'button-positive',
                 onTap: function(e) {
                   ApiService.updateEcologySite({
                     userId:data.userId,
                     token:data.token,
                     id:$stateParams.index,
                     isDelete:1
                   }).success(function(res){
                     if(res.success){
                       $ionicLoading.show({
                           template: "删除成功",
                           noBackdrop: 'true',
                         });
                         $timeout(function() {
                           $ionicLoading.hide();
                           history.go(-1);
                         }, 2000);
                     }else{
                       $ionicLoading.show({
                           template: "删除失败",
                           noBackdrop: 'true',
                         });
                         $timeout(function() {
                           $ionicLoading.hide();
                         }, 2000);
                     }
                   })
                 }
               },
             ]
           });
      }else{
        $state.go('login');
      }
    };
    //跳转帖子详情页
    $scope.topostdetail = function(id){
      $state.go('post_detail',{
        index:id
      })
    }
    //去地图导航
  $scope.gomap = function(lng,lat,addr,name){
    $state.go('map',{
      addrLng:lng,
      addrLat:lat,
      addr:addr,
      name:name
    })
  }
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
  //添加标签
  $scope.gotip = function(type){
    if(localStorage.getItem('userdata')){
      $state.go('site_type',{
        type:type,
        id:$stateParams.index
      })
    }else{
      $state.go('login');
    }
  }
  //第三方分享
  //朋友圈
  $scope.sharecircle = function($event,name,img){
    $event.stopPropagation();
    console.log(XZIp + $location.path());
    Wechat.share({
        message: {
          title: name,
          description:'分享来自生态点点',
          thum:img,
          media: {
              type: Wechat.Type.WEBPAGE,
              webpageUrl:XZIp + $location.path()
            }
        },
        scene: Wechat.Scene.TIMELINE   // share to Timeline
    }, function () {
      $ionicLoading.show({
          template: "分享成功",
          noBackdrop: 'true',
        });
        $timeout(function() {
          $ionicLoading.hide();
        }, 2000);
    }, function (reason) {
      $ionicLoading.show({
          template: '分享失败：' + reason,
          noBackdrop: 'true',
        });
        $timeout(function() {
          $ionicLoading.hide();
        }, 2000);
    });
  }
  //微信好友
  $scope.sharefriend = function(){
    Wechat.share({
        message: {
          title: $scope.persondata.prodname,
          description:'好玩好玩',
          thum:'img/mine/login/2.png',
          media: {
              type: Wechat.Type.LINK,
              webpageUrl: XZIp+$location.path()
          }
        },
        scene: Wechat.Scene.SESSION   // share to Timeline
    }, function () {
      $ionicLoading.show({
          template: "分享成功",
          noBackdrop: 'true',
        });
        $timeout(function() {
          $ionicLoading.hide();
        }, 2000);
    }, function (reason) {
        $ionicLoading.show({
            template: '分享失败：' + reason,
            noBackdrop: 'true',
          });
          $timeout(function() {
            $ionicLoading.hide();
          }, 2000);
    });
  }

});
