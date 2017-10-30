angular.module('homeController', [])
    .controller('homeCtrl',function($scope,ApiService,$cordovaGeolocation,$state,$ionicViewSwitcher,$ionicPopup,$rootScope,$ionicLoading,$timeout){
      var map = new AMap.Map("map", {
        resizeEnable: true,
        zoom:16
      });
      //判断是否定位了城市
      if(sessionStorage.getItem('lng') && !sessionStorage.getItem('nowcity')){
        map.setCenter($scope.lngLat);
        map.getCity(function(data) {
          console.log(data);
          var cityinfo = data.city;
          sessionStorage.setItem('nowcity',cityinfo);
          ApiService.getSysCity({name:encodeURI(cityinfo,'UTF-8')}).success(function(res){
            if(res.success){
              sessionStorage.setItem('nowcityId',res.dataObject.id);
              $rootScope.$broadcast('nowcityChange');
            }
          })
        });
      }
      if(sessionStorage.getItem('isFailure') == 1){
        mapPosition();
      }
      //类型
        $scope.typeList = [];
        ApiService.typeList({type:1}).success(function(res){
          console.log(res);
          if(res.success){
            $scope.typeList = res.dataObject;
          }
        })
      $scope.$on('lngChange',function(){
          if(sessionStorage.getItem('isFailure') == 1){
            mapPosition();
          }else{
            $scope.lngLat = [sessionStorage.getItem('lng'),sessionStorage.getItem('lat')] ;
            map.setCenter($scope.lngLat);
            map.getCity(function(data) {
              console.log(data);
              var cityinfo = data.city;
              sessionStorage.setItem('nowcity',cityinfo);
              ApiService.getSysCity({name:encodeURI(cityinfo,'UTF-8')}).success(function(res){
                if(res.success){
                  sessionStorage.setItem('nowcityId',res.dataObject.id);
                  //$rootScope.$broadcast('nowcityChange');
                  if(localStorage.getItem("city") != cityinfo){
                   var myPopup = $ionicPopup.show({
                      title: '是否切换城市到'+cityinfo,
                      //scope: $scope,
                      buttons: [
                        { text: '取消' },
                        {
                          text: '<b>确定</b>',
                          type: 'button-positive',
                          onTap: function(e) {
                            localStorage.setItem("city",data.city);
                            localStorage.setItem("cityId",res.dataObject.id);
                            $rootScope.$broadcast('cityChange');
                          }
                        },
                      ]
                    });
                   }
                }
              })
            });
            $scope.hasmore = true;
            $scope.pageNo = 1;
            $scope.hotlist = [];
            var viewCount = 1;
            var newFind = '';
            siteList($scope.pageNo,viewCount,newFind);
          }
        });
      $scope.city = localStorage.getItem("city");
      $scope.$on('cityChange',function(){
        $scope.city = localStorage.getItem("city");
        $scope.hasmore = true;
        $scope.pageNo = 1;
        $scope.hotlist = [];
        var viewCount = 1;
        var newFind = '';
        siteList($scope.pageNo,viewCount,newFind);
      })
        //热门推荐
        $scope.i = 0;
        $scope.homeBan = ['热门推荐','新发现'];
        $scope.homeBanclick = function(index){
          $scope.i = index;
          if(index==0){
            $scope.hotlist = [];
            viewCount = 1;
            newFind = '';
            siteList($scope.pageNo,viewCount,newFind);
          }else{
            $scope.hotlist = [];
            viewCount = '';
            newFind = 1;
            siteList($scope.pageNo,viewCount,newFind);
          }
        }
        //首页地点列表
        $scope.pageNo = 1;
        $scope.hotlist = [];
        var viewCount = 1;
        var newFind = '';
        siteList($scope.pageNo,viewCount,newFind);
        function siteList(pageNo,count,news){
          ApiService.ecologySiteList({
            pageNo:pageNo,
            pageSize:5,
            cityId:localStorage.getItem('cityId'),
            viewCount:count,
            newFind:news,
            lng:sessionStorage.getItem('lng'),
            lat:sessionStorage.getItem('lat')
          }).success(function(res){
            console.log(res);
            if(res.dataObject.result.length == 0){
              return;
            }else{
              for(var i=0;i<res.dataObject.result.length;i++){
                $scope.hotlist.push(res.dataObject.result[i]);
                var typeNames = res.dataObject.result[i].appTypeNames.split(' ');
                if(typeNames[typeNames.length-1] == ''){
                  typeNames.splice(typeNames.length - 1,1);
                  $scope.hotlist[$scope.hotlist.length - 1].typeNames = typeNames;
                }else{
                  $scope.hotlist[$scope.hotlist.length - 1].typeNames = typeNames
                }
                $scope.hotlist[$scope.hotlist.length - 1].pic = res.dataObject.result[i].pictures.split(',')[0];
              }
            }
          })
        }
        //跳转详情页
        $scope.todetail = function(id,star){
          $state.go('detail',{
            index:id,
            star:star
          })
        }
        //跳转全部列表页
        $scope.goAllList = function(id,name){
          $state.go('product');
        }
        //跳转列表页
        $scope.goList = function(id,name){
          $state.go('product',{
            index:id,
            type:name
          })
        }
        //查询页面
        $scope.search = function(){
          $state.go('search');
        }
        //地图定位函数
        function mapPosition(){
          console.log(1);
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
            console.log(1);
            $rootScope.$broadcast('lngChange');
            $ionicLoading.hide();
          }
         //解析定位错误信息
          function onError(data) {
            $ionicLoading.hide();
            var centerLng = map.getCenter();
            sessionStorage.setItem('isFailure',2);
            sessionStorage.setItem('lng',centerLng.lng);
            sessionStorage.setItem('lat',centerLng.lat);
            $rootScope.$broadcast('lngChange');
          }
        }
});
