angular.module('map_patternController', [])
    .controller('map_patternCtrl',function($scope,ApiService,$stateParams,$ionicLoading,$state,$ionicPopup,$timeout,$ionicModal){
      //地图模式
      $scope.lnglat = [sessionStorage.getItem('lng'),sessionStorage.getItem('lat')];
      $scope.map = new AMap.Map("mapList", {
        resizeEnable: true,
        center:$scope.lnglat,
        zoom:16
      });
      $scope.map.on('moveend', getdata);
      function getdata(){
       $scope.lngLatObj = $scope.map.getCenter();
       $scope.lnglat = [$scope.lngLatObj.lng,$scope.lngLatObj.lat];
       console.log($scope.lnglat);
       var markers = [];
       $scope.hasmore = true;
       $scope.pageNo = 1;
       $scope.hotlist = [];
       siteList($scope.pageNo,$scope.searchName.name);
      }
      $scope.searchName = {
        name:''
      }
      var markers = [];
      $scope.hasmore = true;
      $scope.pageNo = 1;
      $scope.hotlist = [];
      $scope.loadMore = function () {
        $scope.pageNo ++;
        siteList($scope.pageNo,$scope.searchName.name);
      }
      siteList($scope.pageNo,$scope.searchName.name);
      function siteList(pageNo,name){
        ApiService.ecologySiteList({
          pageNo:pageNo,
          pageSize:5,
          cityId:localStorage.getItem('cityId'),
          appTypeId:$stateParams.type,
          lng:$scope.lnglat[0],
          lat:$scope.lnglat[1],
          name:name
        }).success(function(res){
          console.log(res);
          if(res.dataObject.result.length == 0){
            $scope.hasmore = false;
            return;
          }else{
            for(var i=0;i<res.dataObject.result.length;i++){
              $scope.hotlist.push(res.dataObject.result[i]);
              //markers.push({position: [res.dataObject.result[i].lng, res.dataObject.result[i].lat]});
              if(markers.length<5){
                markers.push({position: [res.dataObject.result[i].lng, res.dataObject.result[i].lat]});
              }
              var typeNames = res.dataObject.result[i].appTypeNames.split(' ');
              if(typeNames[typeNames.length-1] == ''){
                typeNames.splice(typeNames.length - 1,1);
                $scope.hotlist[$scope.hotlist.length - 1].typeNames = typeNames;
              }else{
                $scope.hotlist[$scope.hotlist.length - 1].typeNames = typeNames
              }
              $scope.hotlist[$scope.hotlist.length - 1].pic = res.dataObject.result[i].pictures.split(',')[0];
            }
            markers.forEach(function(marker) {
                var _marker = new AMap.Marker({
                    map: $scope.map,
                    icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                    position: [marker.position[0], marker.position[1]],
                    offset: new AMap.Pixel(-12, -36),
                    clickable : true ,
                });
                $scope.map.setFitView();
            });
          }

          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      }
      $scope.searchSite = function(){
        //console.log($scope.searchName.name);
        $scope.hasmore = true;
        $scope.pageNo = 1;
        $scope.hotlist = [];
        siteList($scope.pageNo,encodeURI($scope.searchName.name,'UTF-8'));
      }
      //跳转详情页
      $scope.todetail = function(id,star){
        $state.go('detail',{
          index:id,
          star:star
        })
      }
});
