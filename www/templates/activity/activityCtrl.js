angular.module('activityController', [])
    .controller('activityCtrl',function($scope,$ionicBackdrop,ApiService,$stateParams,$state,$timeout,$filter,$ionicViewSwitcher,$ionicLoading,$ionicPopup,$rootScope){
      //点击切换类型
      var poscity = sessionStorage.getItem('nowcity');
      $scope.banCont = ['推荐','附近','圈子'];
      if(sessionStorage.getItem('isFailure') == 1){
        $ionicLoading.show({
          template: '<ion-spinner icon="ios"></ion-spinner>'
        });
        mapPosition();
      }
    $scope.circleShow = false;
    $scope.postShow = true;
    $scope.mycircleList = [];
    $scope.randcircleList = [];
    $scope.userdata = JSON.parse(localStorage.getItem('userdata'));
    if(sessionStorage.getItem('order') == 2){
      $scope.i = 2;
      $scope.circleShow = true;
      $scope.postShow = false;
      mycircle();
      sessionStorage.removeItem('order');
    }else{
      $scope.i = 0;
      $scope.circleShow = false;
      $scope.postShow = true;
      loadajax($scope.pageNo,countId,cityId);
    }
    $scope.banclick = function(index){
      $scope.i = index;
      if(index==0){
        $scope.circleShow = false;
        $scope.postShow = true;
        $scope.hasmore = true;
        $scope.pageNo = 1;
        $scope.postlist = [];
        countId = 1;
        cityId = '';
        circlePostLng = '';
        circlePostLat = '';
        loadajax($scope.pageNo,countId,cityId);
      }else if(index==1){
        $scope.circleShow = false;
        $scope.postShow = true;
        $scope.hasmore = true;
        $scope.pageNo = 1;
        $scope.postlist = [];
        countId = '';
        cityId = sessionStorage.getItem('nowcityId');
        circlePostLng = sessionStorage.getItem('lng');
        circlePostLat = sessionStorage.getItem('lat');
        loadajax($scope.pageNo,countId,cityId);
      }else{
        if(localStorage.getItem('userdata')){
          $scope.circleShow = true;
          $scope.postShow = false;
          mycircle();
        }else{
          $state.go('login');
        }
      }
    }
    //圈子列表
    function mycircle(){
      ApiService.myCircleList({userId:$scope.userdata.userId}).success(function(res){
        console.log(res);
        if(res.success){
           $scope.mycircleList = res.dataObject;
        }
      });
      ApiService.randCircleList({userId:$scope.userdata.userId}).success(function(res){
        console.log(res);
        if(res.success){
          $scope.randcircleList = res.dataObject;
          console.log($scope.randcircleList);
        }
      });
    }
    $scope.changeNext = function(){
      ApiService.randCircleList({userId:$scope.userdata.userId}).success(function(res){
        console.log(res);
         $scope.randcircleList = res.dataObject;
        console.log($scope.randcircleList);
      });
    }
      //跳转圈子详情页
      $scope.tocircledetail = function(id,isJoin){
        $state.go('activity_detail',{
          index:id,
          isJoin:isJoin
        })
      }
      //跳转帖子详情页
      $scope.topostdetail = function(id){
        $state.go('post_detail',{
          index:id
        })
      }
      //申请加圈退圈
      $scope.Joincircle = function(id,index,$event){
        $event.stopPropagation();
          ApiService.addCircle({
            userId:$scope.userdata.userId,
            token:$scope.userdata.token,
            id:id
          }).success(function(res){
            if(res.success){
              $scope.mycircleList.push({
                ecologyCircle:{
                  name:$scope.randcircleList[index].name,
                  id:$scope.randcircleList[index].id,
                  photo:$scope.randcircleList[index].photo,
                  appTypeName:$scope.randcircleList[index].appTypeName,
                  postCount:$scope.randcircleList[index].postCount,
                  userCount:$scope.randcircleList[index].userCount
                }
              });
              $ionicLoading.show({
                  template: "加入成功",
                  noBackdrop: 'true',
                });
                $timeout(function() {
                  $ionicLoading.hide();
                }, 2000);
                $scope.randcircleList.splice(index,1);
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
      //帖子列表
      $scope.hasmore = true;
      $scope.pageNo = 1;
      $scope.postlist = [];
      var countId = 1;
      var cityId = '';
      var circlePostLng = '';
      var circlePostLat = '';
      $scope.loadMore = function () {
        $scope.pageNo ++;
        loadajax($scope.pageNo,countId,cityId);
      }
      function loadajax(pageNo,count,city) {
        ApiService.postList({
          pageNo:pageNo,
          pageSize:5,
          viewCount:count,
          cityId:city,
          lng:circlePostLng,
          lat:circlePostLat
        }).success(function(res){
          console.log(res);
          if(res.dataObject.result.length == 0){
            $scope.hasmore = false;
            return;
          }else{
            for(var i=0;i<res.dataObject.result.length;i++){
              $scope.postlist.push(res.dataObject.result[i]);
              var pics = res.dataObject.result[i].pictures.split(',');
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
      //地图定位函数
      function mapPosition(){
        var map = new AMap.Map("map", {
          resizeEnable: true,
          zoom:16
        });
        map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true,        //显示定位按钮，默认：true
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: false,        //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
            useNative:true
        });
          map.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
          AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
        });
        //解析定位结果
        function onComplete(data) {
          console.log(data.position.getLng(),data.position.getLat());
          sessionStorage.setItem('isFailure',2);
          sessionStorage.setItem('lng',data.position.getLng());
          sessionStorage.setItem('lat',data.position.getLat());
          $ionicLoading.hide();
        }
       //解析定位错误信息
        function onError(data) {
          $ionicLoading.hide();
          var centerLng = map.getCenter();
          sessionStorage.setItem('isFailure',2);
          sessionStorage.setItem('lng',centerLng.lng);
          sessionStorage.setItem('lat',centerLng.lat);
          $ionicLoading.hide();
        }
      }
});
