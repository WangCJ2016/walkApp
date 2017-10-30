angular.module('chatController', [])
    .controller('chatCtrl',function($scope,ApiService,$ionicPopup,$ionicBackdrop,$state,$timeout,$stateParams,$ionicLoading, $timeout,$cordovaFileTransfer,$cordovaImagePicker,$cordovaCamera){
      //返回键
      $scope.goback = function(){
        history.go(-1);
      }
      if(sessionStorage.getItem('typename') == '活动'){
        $scope.detailshow = false;
      }else{
        $scope.detailshow = true;
      }
      var data = JSON.parse(localStorage.getItem('userdata'));
      $scope.issuename = sessionStorage.getItem('typename');
      $scope.hasmore = true;
      $scope.pageNo = 0;
      $scope.clubdiscuss = [];
      //loadajax($scope.pageNo)
      $scope.loadMore = function () {
        $scope.pageNo ++;
        loadajax($scope.pageNo);
      }
      function loadajax(pageNo) {
        if(sessionStorage.getItem('typename') == '活动'){
          ApiService.eventCircleList({
            id:$stateParams.index,
            pageNo:pageNo,
            pageSize:5
          }).success(function(res){
            console.log(res);
            if(res.dataObject.eventCircleList.result.length == 0){
              $scope.hasmore = false;//这里判断是否还能获取到数据，如果没有获取数据，则不再触发加载事件
              return;
            }else{
              for(var i = 0;i<res.dataObject.eventCircleList.result.length;i++){
                $scope.clubdiscuss.push(res.dataObject.eventCircleList.result[i]);
                $scope.clubdiscuss[$scope.clubdiscuss.length - 1].images = res.dataObject.eventCircleList.result[i].images.split(',');
              }
              for(var a = 0; a<$scope.clubdiscuss.length;a++){
                if($scope.clubdiscuss[a].images[$scope.clubdiscuss[a].images.length-1] == ''){
                  $scope.clubdiscuss[a].images.pop();
                }
                for (var i = 0; i < $scope.clubdiscuss[a].images.length; i++) {
                    var k = $scope.clubdiscuss[a].images[i];
                    for (var j = i + 1; j < $scope.clubdiscuss[a].images.length; j++) {
                      if ($scope.clubdiscuss[a].images[j] == k) {
                        $scope.clubdiscuss[a].images.splice(j, 1);
                        j = j - 1;
                      }
                    }
                  }
              }
              console.log($scope.clubdiscuss);
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
          })
        }else{
          ApiService.clubCommentList({
              id:$stateParams.index,
              pageNo:pageNo,
              pageSize:10
            }).success(function(res){
              console.log(res);
                if(res.dataObject.clubCommentList.result.length == 0){
                  $scope.hasmore = false;//这里判断是否还能获取到数据，如果没有获取数据，则不再触发加载事件
                  return;
                }else{
                  for(var i = 0;i<res.dataObject.clubCommentList.result.length;i++){
                    $scope.clubdiscuss.push(res.dataObject.clubCommentList.result[i]);
                    $scope.clubdiscuss[$scope.clubdiscuss.length - 1].images = res.dataObject.clubCommentList.result[i].images.split(',');
                  }
                  for(var a = 0; a<$scope.clubdiscuss.length;a++){
                    if($scope.clubdiscuss[a].images[$scope.clubdiscuss[a].images.length-1] == ''){
                      $scope.clubdiscuss[a].images.pop();
                    }
                    for (var i = 0; i < $scope.clubdiscuss[a].images.length; i++) {
                        var k = $scope.clubdiscuss[a].images[i];
                        for (var j = i + 1; j < $scope.clubdiscuss[a].images.length; j++) {
                          if ($scope.clubdiscuss[a].images[j] == k) {
                            $scope.clubdiscuss[a].images.splice(j, 1);
                            j = j - 1;
                          }
                        }
                      }
                  }
                  console.log($scope.clubdiscuss);
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
            })
          }
        }
        //进入详情页
        $scope.godetail = function(){
          if(sessionStorage.getItem('typename') == '活动'){
            $state.go('apply',{
              id:$stateParams.index
            })
          }else{
            $state.go('club_data',{
              id:$stateParams.index
            })
          }
        }
        //照相机
        $scope.goCamera = function(){
          $scope.sendpic = '';
          var options = {
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.CAMERA,
          };
          $cordovaCamera.getPicture(options).then(function(imageURI) {
            $ionicLoading.show({
              template: '<ion-spinner icon="ios"></ion-spinner>'
            });
            console.log(imageURI);
            var url = 'http://106.15.103.123:8080/xingzhe/appPhotoUploadServlet';
            var options = {};
            $cordovaFileTransfer.upload(url,imageURI, options)
             .then(function(result) {
               console.log(JSON.parse(result.response).fileUrl);
               $scope.sendpic += JSON.parse(result.response).fileUrl + ',';
               console.log($scope.sendpic);
               $ionicLoading.hide();
             }, function(err) {
               // Error
             }, function (progress) {
               // constant progress updates
             });

           }, function(err) {
               // error
           });
        }
        //相册
        $scope.imgpicker = function(){
          $scope.sendpic = '';
          $scope.pictureArr = [];
          var options = {
              maximumImagesCount:3,
              width: 800,
              height: 800,
              quality: 50
            };
          $cordovaImagePicker.getPictures(options)
              .then(function(results) {
                console.log(results);
                if(results.length == 0){
                  var myPopup = $ionicPopup.show({
                        title: '已取消'
                    });
                    $ionicBackdrop.release();
                    $timeout(function() {
                        myPopup.close();
                    }, 2000);
                }else{
                  for (var i = 0; i < results.length; i++) {
                      upImages(results[i],results.length);
                  }
                  $ionicLoading.show({
                    template: '<ion-spinner icon="ios"></ion-spinner>'
                  });
                }
              }, function(error) {
                var myPopup = $ionicPopup.show({
                        title: '已取消'
                    });
                    $ionicBackdrop.release();
                    $timeout(function() {
                        myPopup.close();
                    }, 2000);
              });
        }
        //图片上传
        function upImages(imgsrc,len){
          var url = 'http://106.15.103.123:8080/xingzhe/appPhotoUploadServlet';
          var options = {};
          $cordovaFileTransfer.upload(url,imgsrc,options)
           .then(function(result) {
             $scope.pictureArr.push(JSON.parse(result.response).fileUrl);
             $scope.sendpic += JSON.parse(result.response).fileUrl + ',';
             console.log($scope.pictureArr);
             console.log($scope.sendpic);
            if($scope.pictureArr.length == len){
              $ionicLoading.hide();
            }
           }, function(err) {
             // Error
           }, function (progress) {
             // constant progress updates
           });

        }
        //添加评论
        $scope.discussdata = {
          content:''
        }
        //判断输入框是否为空
          var checkinput = function(){
            if($scope.discussdata.content == ''){
              $ionicLoading.show({
                  template: "请输入内容",
                  noBackdrop: 'true',
                });
                $timeout(function() {
                  $ionicLoading.hide();
                }, 2000);
                return false;
            }else{
              return true;
            }
          }
          //判断是否选则图片
          var checkpics = function(){
            if($scope.sendpic == ''){
              $ionicLoading.show({
                  template: "请选择图片",
                  noBackdrop: 'true',
                });
                $timeout(function() {
                  $ionicLoading.hide();
                }, 2000);
                return false;
            }else{
              return true;
            }
          }
         $scope.adddiscuss = function(){
           if(sessionStorage.getItem('typename') == '活动'){
              if(checkinput()&&checkpics()){
                 ApiService.addEventCircle({
                   userId:data.userId,
                   token:data.token,
                   id:$stateParams.index,
                   content:encodeURI($scope.discussdata.content,'UTF-8'),
                   images:$scope.sendpic
                 }).success(function(res){
                   if(res.success){
                     $scope.clubdiscuss.unshift({
                       content:$scope.discussdata.content,
                       user:{
                         photo:data.photo,
                         nickname:data.nickname,
                         userName:data.userName
                       }
                     });
                     $scope.clubdiscuss[0].images = $scope.sendpic.substring(0,$scope.sendpic.length-1).split(',');
                     $ionicLoading.show({
                         template: "留言成功",
                         noBackdrop: 'true',
                       });
                       $timeout(function() {
                         $ionicLoading.hide();
                       }, 2000);
                   }
                 })
              }
           }else{
             if(checkinput()&&checkpics()){
               console.log($scope.pictureArr);
               console.log($scope.sendpic);
               ApiService.addClubComment({
                 userId:data.userId,
                 token:data.token,
                 id:$stateParams.index,
                 content:encodeURI($scope.discussdata.content,'UTF-8'),
                 images:$scope.sendpic
               }).success(function(res){
                 if(res.success){
                   $scope.clubdiscuss.unshift({
                     content:$scope.discussdata.content,
                     user:{
                       photo:data.photo,
                       nickname:data.nickname,
                       userName:data.userName
                     }
                   });
                   $scope.clubdiscuss[0].images = $scope.sendpic.substring(0,$scope.sendpic.length-1).split(',');
                   $ionicLoading.show({
                       template: "留言成功",
                       noBackdrop: 'true',
                     });
                     $timeout(function() {
                       $ionicLoading.hide();
                     }, 2000);
                 }
               })
             }
           }
         }


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
