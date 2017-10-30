angular.module('person_dataController', [])
    .controller('person_dataCtrl',function($scope,ApiService,$ionicPopup,$ionicBackdrop,$state,$timeout,$stateParams){
      $scope.siteShow = true;
      $scope.postShow = false;
      $scope.circleShow = false;
      $scope.nickName = '';
      $scope.userphoto = '';
      $scope.userdata = JSON.parse(localStorage.getItem('userdata'));
      if($scope.userdata.userId == $stateParams.userId){
        $scope.nickName = $scope.userdata.naickname;
        $scope.userphoto = $scope.userdata.photo;
      }
      $scope.mysite = function(res){
        $scope.siteShow = true;
        $scope.postShow = false;
        $scope.circleShow = false;
        $scope.hasmore1 = false;
        $scope.hasmore = true;
      }
      $scope.mypost = function(res){
        $scope.siteShow = false;
        $scope.postShow = true;
        $scope.circleShow = false;
        $scope.hasmore1 = true;
        $scope.hasmore = false;
        $scope.pageNo1 = 1;
        $scope.mypostlist = [];
        myPost($scope.pageNo1);

      }
      $scope.mycircle = function(res){
        $scope.siteShow = false;
        $scope.postShow = false;
        $scope.circleShow = true;
        $scope.hasmore1 = false;
        $scope.hasmore = false;
        $scope.mycirclelist = [];
        myCircle();
      }
      //我的地点
      $scope.hasmore = true;
      $scope.pageNo = 1;
      $scope.mysitelist = [];
      $scope.loadMore = function () {
        $scope.pageNo ++;
        loadajax($scope.pageNo);
      }
      loadajax($scope.pageNo);
      function loadajax(pageNo) {
        ApiService.ecologySiteList({
          pageNo:pageNo,
          pageSize:5,
          userId:$stateParams.userId,
          //cityId:122
        }).success(function(res){
          console.log(res);
          if(res.dataObject.result.length == 0){
            $scope.hasmore = false;
            return;
          }else{
            for(var i=0;i<res.dataObject.result.length;i++){
              $scope.mysitelist.push(res.dataObject.result[i]);
              $scope.mysitelist[$scope.mysitelist.length - 1].pics = res.dataObject.result[i].pictures.split(',');
              var typeNames = res.dataObject.result[i].appTypeNames.split(' ');
              if(typeNames[typeNames.length-1] == ''){
                typeNames.splice(typeNames.length - 1,1);
                $scope.mysitelist[$scope.mysitelist.length - 1].typeNames = typeNames;
              }else{
                $scope.mysitelist[$scope.mysitelist.length - 1].typeNames = typeNames
              }
            }
            console.log($scope.mysitelist);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      }
      //我的帖子
      $scope.hasmore1 = false;
      $scope.loadMorePost = function () {
        $scope.pageNo1 ++;
        myPost($scope.pageNo1);
      }
      function myPost(pageNo1){
        ApiService.postList({
          userId:$stateParams.userId,
          pageNo:pageNo1,
          pageSize:6,
        }).success(function(res){
          console.log(res);
          if(res.dataObject.result.length == 0){
            $scope.hasmore1 = false;
            return;
          }else{
            for(var i=0;i<res.dataObject.result.length;i++){
              $scope.mypostlist.push(res.dataObject.result[i]);
              var Postpics = res.dataObject.result[i].pictures.split(',');
              if(Postpics[Postpics.length-1] == ''){
                Postpics.splice(Postpics.length - 1,1);
                $scope.mypostlist[$scope.mypostlist.length - 1].pics = Postpics;
              }else{
                $scope.mypostlist[$scope.mypostlist.length - 1].pics = Postpics
              }

            }
            console.log($scope.mypostlist);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      }
      //我的圈子
      function myCircle(pageNo1){
        ApiService.myCircleList({
          userId:$stateParams.userId,
          type:1
        }).success(function(res){
          console.log(res);
          if(res.success){
            for(var i=0;i<res.dataObject.length;i++){
              $scope.mycirclelist.push(res.dataObject[i]);
              var Postpics = res.dataObject[i].ecologyCircle.photo.split(',');
              if(Postpics[Postpics.length-1] == ''){
                Postpics.splice(Postpics.length - 1,1);
                $scope.mycirclelist[$scope.mycirclelist.length - 1].pics = Postpics;
              }else{
                $scope.mycirclelist[$scope.mycirclelist.length - 1].pics = Postpics
              }
            }
          }
        })
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
      //地点详情
      $scope.todetail = function(id,star){
        $state.go('detail',{
          index:id,
          star:star,
          mine:1
        })
      }
});
