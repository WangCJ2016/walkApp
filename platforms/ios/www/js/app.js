// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova','starter.controllers', 'starter.services','starter.directives','ionic-datepicker'])
.constant('xingzheUrl', 'http://106.15.103.123:8080/ecology')
.constant("XZIp","http://106.15.103.123:8080/ecology/walkApp/www/index.html#")
.run(function($ionicPlatform,$ionicPopup,$rootScope,$state,$ionicHistory,$cordovaGeolocation,$ionicLoading,ApiService,$location,$timeout,$ionicHistory, $cordovaToast,$cordovaDevice) {
  $ionicPlatform.ready(function() {
    if(!localStorage.getItem("city")){
  		localStorage.setItem("city","杭州市");
      localStorage.setItem("cityId",122);
      $rootScope.$broadcast('cityChange');
  	}
    baidu_location.getCurrentPosition(successCallback, failedCallback);
    function successCallback(data){
      console.log(data);
       ApiService.lngLat({
         locations: data.longitude +','+data.latitude,
         coordsys:'baidu',
         output:'JSON',
         key:'1cb1df08a28b941bc40050f6a9262bb1'
       }).success(function(res){
         //console.log(res);
         var lnglat = res.locations.split(',');
         sessionStorage.setItem('lng',lnglat[0]);
         sessionStorage.setItem('lat',lnglat[1]);
         $rootScope.$broadcast('lngChange');
         $ionicLoading.hide();
       })
     }
     function failedCallback(err){
        //  失败的提示操作
       sessionStorage.setItem('isFailure',1);
       $rootScope.$broadcast('lngChange');
     };
    // 登录跳转
    $rootScope.goLogin = function(url){
        var userdata = localStorage.getItem('userdata');
        if(!localStorage.getItem('userdata')){
          $state.go('login');
        }else{
          $state.go(url);
        }
    };
    //sessionStorage.setItem('isPosition',1);
    // 返回上级页面
    $rootScope.goBack = function(){
      $ionicHistory.goBack();
    };
    //返回前一页
    $rootScope.goback = function(){
      history.go(-1);
    }
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      //cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      // $cordovaStatusbar.overlaysWebView(true);
      // var isVisible = $cordovaStatusbar.isVisible();
      StatusBar.styleLightContent();
      StatusBar.backgroundColorByHexString('#14b473');
    }
    // var posOptions = {maximumAge: 0,timeout: 10000, enableHighAccuracy: false};
    // $cordovaGeolocation
    //   .getCurrentPosition(posOptions)
    //   .then(function (position) {
    //     //console.log(position);
    //     ApiService.lngLat({
    //       locations:position.coords.longitude +','+position.coords.latitude,
    //       coordsys:'baidu',
    //       output:'JSON',
    //       key:'1cb1df08a28b941bc40050f6a9262bb1'
    //     }).success(function(res){
    //       //console.log(res);
    //       var lnglat = res.locations.split(',');
    //       //console.log(lnglat);
    //       sessionStorage.setItem('lng',lnglat[0]);
    //       sessionStorage.setItem('lat',lnglat[1]);
    //       $rootScope.$broadcast('lngChange');
    //       $ionicLoading.hide();
    //     })
    //   }, function(err) {
    //     sessionStorage.setItem('isFailure',1);
    //     $rootScope.$broadcast('lngChange');
    //     // error
    //   });
  });
  //返回键退出APP
  $ionicPlatform.registerBackButtonAction(function (e) {
      e.preventDefault();
      function showConfirm() {
        var confirmPopup = $ionicPopup.confirm({
          title: '<strong>确定退出应用吗？</strong>',
          okText: '退出',
          cancelText: '取消'
        });
        confirmPopup.then(function (res) {
          if (res) {
            ionic.Platform.exitApp();
          }
          else {
            // Don't close
          }
        });
      }
      // Is there a page to go back to?
      if ($location.path() == '/tab/home' ) {
        showConfirm();
      } else if ($ionicHistory.backView()) {
       $ionicHistory.goBack();
      } else {
        // This is the last page: Show confirmation popup
        showConfirm();
      }
      return false;
    }, 101);
})
.config(function($httpProvider) {
    $httpProvider.defaults.headers.post = { 'Content-Type':'application/x-www-form-urlencoded'}
})
.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.style('striped').position('bottom');
})
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs/tabs.html'
  })
  // Each tab has its own nav history stack:
  .state('tab.home', {
    url: '/home',
    cache: false,
    views: {
      'tab-home': {
        templateUrl: 'templates/home/home.html',
        controller:'homeCtrl'
      }
    }
  })

  .state('tab.activity', {
      url: '/activity',
      cache: false,
      views: {
        'tab-activity': {
          templateUrl: 'templates/activity/activity.html',
          controller:'activityCtrl'
        }
      }
    })
    .state('tab.club', {
      url: '/club',
      views: {
        'tab-club': {
          templateUrl: 'templates/club/club.html',
          controller:''
        }
      }
    })

  .state('tab.mine', {
    url: '/mine',
    cache: false,
    views: {
      'tab-mine': {
        templateUrl: 'templates/mine/mine.html',
        controller:'mineCtrl'
      }
    }
  })
  .state('mydata', {
      url: '/mydata',
      cache: false,
      templateUrl: 'templates/mine/mydata/mydata.html',
      controller:'mydataCtrl'
  })
  .state('product', {
      url: '/product/:index/:type',
      cache: false,
      templateUrl: 'templates/home/product/product.html',
      controller:'productCtrl',
  })
  .state('issue_history', {
      url: '/issue_history',
      cache: false,
      templateUrl: 'templates/home/issue_history/issue_history.html',
      controller:'issue_historyCtrl'
  })
  .state('discuss_list', {
      url: '/discuss_list/:id',
      cache: false,
      templateUrl: 'templates/home/discuss_list/discuss_list.html',
      controller:'discuss_listCtrl'
  })
  .state('search', {
      url: '/search', //1为主页搜索，2为俱乐部搜索
      templateUrl: 'templates/home/search/search.html',
      controller:'searchCtrl'
  })
  .state('report', {
      url: '/report/:id',
      cache: false,
      templateUrl: 'templates/home/report/report.html',
      controller:'reportCtrl'
  })
  .state('site_type', {
      url: '/site_type/:type/:id',
      cache: false,
      templateUrl: 'templates/home/site_type/site_type.html',
      controller:'site_typeCtrl'
  })
  .state('map_pattern', {
      url: '/map_pattern/:type',
      cache: false,
      templateUrl: 'templates/home/map_pattern/map_pattern.html',
      controller:'map_patternCtrl'
  })
  .state('site_search', {
      url: '/site_search',
      cache: false,
      templateUrl: 'templates/home/site_search/site_search.html',
      controller:'site_searchCtrl'
  })
  .state('login', {
      url: '/login',
      templateUrl: 'templates/mine/login/login.html',
      controller:'loginCtrl'
  })
  .state('register', {
      url: '/register',
      cache: false,
      templateUrl: 'templates/mine/register/register.html',
      controller:'registerCtrl'
  })
  .state('register_complete', {
      url: '/register_complete/:tel/:code',
      templateUrl: 'templates/mine/register/register_complete.html',
      controller:'registerCtrl'
  })
  .state('person_data', {
      url: '/person_data/:userId',
      cache: false,
      templateUrl: 'templates/mine/person_data/person_data.html',
      controller:'person_dataCtrl'
  })
  .state('chatlist', {
      url: '/chatlist',
      cache: false,
      templateUrl: 'templates/mine/chatList/chatlist.html',
      controller:'chatlistCtrl'
  })
  .state('privateChat', {
      url: '/privateChat/:id',
      cache: false,
      templateUrl: 'templates/mine/privateChat/privateChat.html',
      controller:'privateChatCtrl'
  })
  .state('my_message', {
      url: '/my_message',
      templateUrl: 'templates/mine/my_message/my_message.html',
      controller:'registerCtrl'
  })
  .state('changename', {
      url: '/changename',
      cache: false,
      templateUrl: 'templates/mine/change/changename.html',
      controller:'changeCtrl'
  })
  .state('changesex', {
      url: '/changesex',
      cache: false,
      templateUrl: 'templates/mine/change/changesex.html',
      controller:'changeCtrl'
  })
  .state('changepwd', {
      url: '/changepwd',
      cache: false,
      templateUrl: 'templates/mine/changepwd/changepwd.html',
      controller:'changepwdCtrl'
  })
  .state('forgetPwd', {
      url: '/forgetPwd',
      templateUrl: 'templates/mine/forgetPwd/forgetPwd.html',
      controller:'forgetPwdCtrl'
  })
  .state('findpwd', {
      url: '/findpwd/:tel/:code',
      cache: false,
      templateUrl: 'templates/mine/forgetPwd/findpwd.html',
      controller:'forgetPwdCtrl'
  })
  .state('activity_detail', {
      url: '/activity_detail/:index/:isJoin',
      cache: false,
      templateUrl: 'templates/activity/activity_detail/activity_detail.html',
      controller:'activity_detailCtrl'
  })
  .state('map', {
      url: '/map/:addrLng/:addrLat/:addr/:name',///:addrLng/:addrLat
      cache: false,
      templateUrl: 'templates/activity/map/map.html',
      controller:'mapCtrl'
  })
  .state('newActive', {
      url: '/newActive',
      cache: false,
      templateUrl: 'templates/activity/newActive/newActive.html',
      controller:'newActiveCtrl'
  })
  .state('issue_post', {
      url: '/issue_post/:id/:postid',
      templateUrl: 'templates/activity/issue_post/issue_post.html',
      controller:'issue_postCtrl'
  })
  .state('post_detail', {
      url: '/post_detail/:index',
      cache: false,
      templateUrl: 'templates/activity/post_detail/post_detail.html',
      controller:'post_detailCtrl'
  })
  .state('Aboutpost', {
      url: '/Aboutpost/:index',
      cache: false,
      templateUrl: 'templates/activity/Aboutpost/aboutpost.html',
      controller:'AboutpostCtrl'
  })
  .state('chat', {
      url: '/chat/:index',
      cache: false,
      templateUrl: 'templates/activity/chat/chat.html',
      controller:'chatCtrl'
  })
  .state('say_some', {
      url: '/say_some/:id',
      cache: false,
      templateUrl: 'templates/activity/say_some/say_some.html',
      controller:'say_someCtrl'
  })
  .state('take_part', {
      url: '/take_part',
      cache: false,
      templateUrl: 'templates/activity/take_part/take_part.html',
      controller:'take_partCtrl'
  })
  .state('relator_place', {
      url: '/relator_place',
      cache: false,
      templateUrl: 'templates/activity/relator_place/relator_place.html',
      controller:'relator_placeCtrl'
  })
  .state('getcity', {
      url: '/getcity/:ischange',
      cache: false,
      templateUrl: 'templates/home/getcity/getcity.html',
      controller:'getcityCtrl'
  })
  .state('choosecity', {
      url: '/choosecity/:pid/:ischange',
      templateUrl: 'templates/home/getcity/choosecity.html',
      controller:'choosecityCtrl'
  })
  .state('discuss', {
      url: '/discuss/:id',
      cache: false,
      templateUrl: 'templates/home/discuss/discuss.html',
      controller:'discussCtrl'
  })
  .state('issue_new', {
      url: '/issue_new',
      cache: false,
      templateUrl: 'templates/home/issue_new/issue_new.html',
      controller:'issue_newCtrl'
  })
  .state('morepic', {
      url: '/morepi/:index',
      cache: false,
      templateUrl: 'templates/activity/morepic/morepic.html',
      controller:'morepicCtrl'
  })
  .state('detail', {
      url: '/detail/:index/:star/:mine',
      cache: false,
      templateUrl: 'templates/home/detail/detail.html',
      controller:'detailCtrl'
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
