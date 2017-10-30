angular.module('productController', [])
    .controller('productCtrl',function($scope,$ionicBackdrop,ApiService,$stateParams,$state,$ionicViewSwitcher,$ionicModal,$ionicLoading,$timeout){
        var cityId = localStorage.getItem('cityId');
        $scope.prodsort = ['离我最近','评价最高','人气最高'];
        $scope.listshow = false;
        $scope.sortshow = false;
        $scope.way = function() {
          $scope.sortshow = false;
          $scope.listshow = !$scope.listshow;
        }
        $scope.show = function() {
          $scope.listshow = false;
          $scope.sortshow = !$scope.sortshow;
        }
        $scope.searchName = {
          name:''
        }
        //列表参数
        var typeId = '';
        if($stateParams.index){
          typeId = ',' + $stateParams.index + ',';
          $scope.checkedList = [{name:$stateParams.type,id:$stateParams.index}];
        }else{
          typeId = '';
          $scope.checkedList = [];
        };
        $scope.hasmore = true;
        $scope.listArr = [];
        $scope.pageNo = 1;
        //区域
        $scope.areaArr = [{name:'全部',id:0}];
        $scope.regionId = '';
        //显示区域
        if(localStorage.getItem('cityId') == sessionStorage.getItem('nowcityId')){
          $scope.lngLat = [sessionStorage.getItem('lng'),sessionStorage.getItem('lat')];
          $scope.map = new AMap.Map("map", {
            resizeEnable: true,
            center:  $scope.lngLat,
            zoom:16
          });
          $scope.map.getCity(function(data) {
             $scope.district = data.district;
             ApiService.getSysRegionList({parentId:cityId}).success(function(res){
               for(var i = 0; i<res.dataObject.length;i++){
                 $scope.areaArr.push(res.dataObject[i]);
                 if($scope.district == res.dataObject[i].name){
                   $scope.regionId = res.dataObject[i].id;
                 }
               }
               loadajax($scope.pageNo,typeId,$scope.regionId,'');
               $scope.loadMore = function () {
                 $scope.pageNo ++;
                 loadajax($scope.pageNo,typeId,$scope.regionId);
               }
             });
         });
        }else{
          $scope.district = '全部';
          ApiService.getSysRegionList({parentId:cityId}).success(function(res){
            for(var i = 0; i<res.dataObject.length;i++){
              $scope.areaArr.push(res.dataObject[i]);
            }
          });
          loadajax($scope.pageNo,typeId,$scope.regionId,'');
          $scope.loadMore = function () {
            $scope.pageNo ++;
            loadajax($scope.pageNo,typeId,$scope.regionId,'');
          }
        }
       //列表
       function loadajax(pageNo,types,regionId,name){
          $scope.listsend = {
            cityId:cityId,
            pageNo:pageNo,
            pageSize:6,
            regionId:regionId,
            star:'',
            appTypeId:types,
            lng:sessionStorage.getItem('lng'),
            lat:sessionStorage.getItem('lat'),
            name:name
          }
          console.log($scope.listsend);
          ApiService.ecologySiteList($scope.listsend).success(function(res){
            console.log(res);
            if(res.dataObject.result.length == 0){
              $scope.hasmore = false;//这里判断是否还能获取到数据，如果没有获取数据，则不再触发加载事件
              return;
            }else{
              for(var i=0; i<res.dataObject.result.length;i++){
                $scope.listArr.push(res.dataObject.result[i]);
                var typeNames = res.dataObject.result[i].appTypeNames.split(' ');
                if(typeNames[typeNames.length-1] == ''){
                  typeNames.splice(typeNames.length - 1,1);
                  $scope.listArr[$scope.listArr.length - 1].typeNames = typeNames;
                }else{
                  $scope.listArr[$scope.listArr.length - 1].typeNames = typeNames
                }
              }
            }
            console.log($scope.listArr);
            $scope.$broadcast('scroll.infiniteScrollComplete');
          })
        }
        //地图模式
        $scope.gomapList = function(){
          $state.go('map_pattern',{
            type:typeId
          })
        }
        //搜索modal层
        var typename = [$stateParams.type];
        console.log($scope.checkedList);
        //类型
        $scope.site_type = [];
        ApiService.typeList({
          type:1
        }).success(function(res){
          console.log(res);
          if(res.success){
            $scope.site_type = res.dataObject;
            for(var i = 0;i < $scope.site_type.length;i++){
              for(var j=0;j < typename.length;j++){
                if($scope.site_type[i].name == typename[j]){
                  $scope.site_type[i].checked = true;
                  break;
                }else{
                  $scope.site_type[i].checked = false;
                }
              }
            }
          }
        });
        $ionicModal.fromTemplateUrl('modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal = modal;
        });
        $scope.openModal = function() {
          $scope.modal.show();
          $scope.checkClick = function(index,ischecked,id){
            if(ischecked == false){
              if($scope.checkedList.length >= 3){
                $ionicLoading.show({
                    template: "最多只能选择3个哦",
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
              $scope.site_type[index].checked = false;
              for(var i = 0;i < $scope.checkedList.length;i++){
                if($scope.checkedList[i].id == id){
                  $scope.checkedList.splice(i,1);
                }
              }
            }
          }
        };
        $scope.closeModal = function() {
          typeId = ',';
          if($scope.checkedList != ''){
            for(var i = 0;i < $scope.checkedList.length;i++){
              typeId += $scope.checkedList[i].id + ',';
            }
          }
          $scope.hasmore = true;
          $scope.listArr = [];
          $scope.pageNo = 1;
          console.log($scope.regionId);
          loadajax($scope.pageNo,typeId,$scope.regionId,$scope.searchName.name);
          //console.log();
          //console.log(typeIds);
          $scope.modal.hide();
        };
        //当我们用到模型时，清除它！
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });
        // 当隐藏的模型时执行动作
        $scope.$on('modal.hide', function() {
          // 执行动作
        });
        // 当移动模型时执行动作
        $scope.$on('modal.removed', function() {
          // 执行动作
        });
        //跳转详情页
        $scope.todetail = function(id,star){
          $state.go('detail',{
            index:id,
            star:star
          })
        }
      //   //点击对应的排序
        $scope.sortclick = function(index){
          $scope.sortshow = false;
          $scope.j = index;
          if(index == 0){
            for(var i = 0;i<$scope.listArr.length - 1;i++){
              for(var j = 0;j<$scope.listArr.length - i - 1;j++){
                if($scope.listArr[j].scope > $scope.listArr[j+1].scope){
                  var temp = $scope.listArr[j];
                  $scope.listArr[j] = $scope.listArr[j+1];
                  $scope.listArr[j+1] = temp;
                }
              }
            }
          }else if(index == 1){
            for(var i = 0;i<$scope.listArr.length - 1;i++){
              for(var j = 0;j<$scope.listArr.length - i - 1;j++){
                if($scope.listArr[j].star<$scope.listArr[j+1].star){
                  var temp = $scope.listArr[j];
                  $scope.listArr[j] = $scope.listArr[j+1];
                  $scope.listArr[j+1] = temp;
                }
              }
            }
          }else{
            for(var i = 0;i<$scope.listArr.length - 1;i++){
              for(var j = 0;j<$scope.listArr.length - i - 1;j++){
                if($scope.listArr[j].viewCount<$scope.listArr[j+1].viewCount){
                  var temp = $scope.listArr[j];
                  $scope.listArr[j] = $scope.listArr[j+1];
                  $scope.listArr[j+1] = temp;
                }
              }
            }
          }
        }
        //点击对应的区域
        $scope.areaclick = function(index,id,name){
          $scope.listshow = false;
          $scope.district = name;
          $scope.t = index;
          $scope.regionId = id;
          $scope.hasmore = true;
          $scope.listArr = [];
          $scope.pageNo = 1;
          loadajax($scope.pageNo,typeId,$scope.regionId);
        }
});
