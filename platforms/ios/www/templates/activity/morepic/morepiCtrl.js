angular.module('morepicController', [])
    .controller('morepicCtrl',function($scope,ApiService,$cordovaImagePicker,$timeout,$ionicPopup,$ionicBackdrop,$cordovaFileTransfer,$stateParams,$state,$ionicLoading){
      var typename = sessionStorage.getItem('typename');
      var userdata = JSON.parse(localStorage.getItem('userdata'));
      $scope.Allpics = [];
      $scope.picsdata = [];
      $scope.hasmore = true;
      $scope.pageNo = 1;
      loadajax($scope.pageNo);
      //加载更多
      $scope.loadMore = function () {
        $scope.pageNo ++;
        loadajax($scope.pageNo);
      }
      function loadajax(pageNo) {
        ApiService.ecologySitePictureList({
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
              $scope.picsdata.push(res.dataObject.result[i]);
              var pic = res.dataObject.result[i].pictures.split(',');
               if(pic[pic.length - 1] == ''){
                 pic.splice(pic.length - 1,1);
                 $scope.picsdata[$scope.picsdata.length - 1].pics = pic
               }else{
                 $scope.picsdata[$scope.picsdata.length - 1].pics = pic
               }
               for(var k = 0;k < pic.length;k++){
                 $scope.Allpics.push(pic[k]);
               }
               for (var a = 0; a < $scope.picsdata[$scope.picsdata.length - 1].pics.length; a++) {
                  var k = $scope.picsdata[$scope.picsdata.length - 1].pics[a];
                  for (var j = a + 1; j < $scope.picsdata[$scope.picsdata.length - 1].pics.length; j++) {
                    if ($scope.picsdata[$scope.picsdata.length - 1].pics[j] == k) {
                      $scope.picsdata[$scope.picsdata.length - 1].pics.splice(j, 1);
                      j = j - 1;
                    }
                  }
              }
            }
            //console.log($scope.Allpics);
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      }
      // 放大图片
      $scope.big_pics = '';
      $scope.pic_index = 0;
      $scope.big_pic_fun = function(pics , pic){
        $scope.big_pics = $scope.Allpics;
        $scope.big_pic = pic;
        for(var i=0; i<$scope.Allpics.length ; i++){
          if ( $scope.Allpics[i] == pic ) {
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
    //添加图片
    $scope.addpics = function(){
      if(!localStorage.getItem('userdata')){
        $state.go('login');
      }else{
        $scope.picture = '';
        $scope.pictureArr = [];
        var options = {
            maximumImagesCount:9,
            width: 800,
            height: 800,
            quality: 50
          };
        $cordovaImagePicker.getPictures(options)
            .then(function(results) {
              console.log(results);
              if(results.length == 0){
                  $ionicLoading.show({
                    template: "已取消",
                    noBackdrop: 'true',
                  });
                  $timeout(function() {
                    $ionicLoading.hide();
                  }, 2000);
              }else{
                for (var i = 0; i < results.length; i++) {
                    //console.log('Image URI: ' + results[i]);
                    upImages(results[i],results.length);
                }
              }
            }, function(error) {
                  $ionicLoading.show({
                    template: "图片路径错误",
                    noBackdrop: 'true',
                  });
                  $timeout(function() {
                    $ionicLoading.hide();
                  }, 2000);
            });

      }
    }
      //图片上传
      var date = new Date();
      function upImages(imgsrc,len){
        var url = 'http://106.15.103.123:8080/ecology/appPhotoUploadServlet';
        var options = {};
        $cordovaFileTransfer.upload(url,imgsrc, options)
         .then(function(result) {
           console.log(JSON.parse(result.response).fileUrl[0]);
           $scope.picture += JSON.parse(result.response).fileUrl[0] + ',';
           $scope.pictureArr.push(JSON.parse(result.response).fileUrl[0]);
           if($scope.pictureArr.length == len){
             //console.log($scope.picture);
               ApiService.addEcologySitePicture({
                 userId:userdata.userId,
                 token:userdata.token,
                 id:$stateParams.index,
                 pictures:$scope.picture
               }).success(function(res){
                 if(res.success){
                       $ionicLoading.show({
                         template: "图片上传成功",
                         noBackdrop: 'true',
                       });
                       $timeout(function() {
                         $ionicLoading.hide();
                       }, 2000);
                       $scope.picsdata.unshift({
                           userNickname:userdata.nickname,
                           userPhoto:userdata.photo,
                           createTime:date.getFullYear() + '-' + date.getMonth() + '-'+date.getDate()
                       });
                       $scope.picsdata[0].pics = $scope.pictureArr;
                       console.log($scope.picsdata);
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
                     }, 2000);
                   }
                 }
               })
           }
         }, function(err) {
           // Error
         }, function (progress) {
           // constant progress updates
         });
      }
});
