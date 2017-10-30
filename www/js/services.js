angular.module('starter.services', [])

.factory('ApiService', function($http,xingzheUrl) {
    return{
      //城市定位
      getnowCtiy:function(){
        return $http({　
            method: 'GET',
            url: 'https://restapi.amap.com/v3/ip?output=json&key=c2f79702cf8e2d5b7e6d94e9e8e9c049',
            //params: data
        });
      },
      //注册加密
      getRegSign:function(){
        return $http({　
            method: 'POST',
            url: xingzheUrl + '/client/user_getRegSign',
            //params: data
        });
      },
        //获取注册验证码
        code:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/user_regGetVerifyCode',
              params: data
          });
        },
        //注册
        regsiter:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/user_reg',
              params: data
          });
        },
        //登录
        login:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/user_login',
              params: data
          });
        },
        //不同设备登录
        switchLogin:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/user_switchLogin',
              params: data
          });
        },
        //找回密码时获取手机验证码
        resetPasswordGetVerifyCode:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/user_resetPasswordGetVerifyCode',
              params: data
          });
        },
        //找回密码
        resetPassword:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/user_resetPassword',
              params: data
          });
        },
        //修改资料
        changedata:function(data){
          return $http({　
              method: 'POST',
              url:xingzheUrl +'/client/user_updateUser',
              params:data
          });
        },
        //城市列表
        getSysRegionList:function(data){
          return $http({　
              method: 'POST',
              url:xingzheUrl +'/client/system_getSysRegionList',
              params:data
          });
        },
        //城市定位获取ID
        getSysCity:function(data){
          return $http({　
              method: 'POST',
              url:xingzheUrl +'/client/system_getSysRegionInfo',
              params:data
          });
        },
        //添加生态地点
        addEcologySite:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/site_addEcologySite',
              params: data
          });
        },
        //类型列表
        typeList:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/system_getSysAppTypeList',
              params: data
          });
        },
        //地点列表
        ecologySiteList:function(data){
          return $http({　
              method: 'POST',
              //http://192.168.11.114:8080/ecology
              url: xingzheUrl + '/client/site_ecologySiteList',
              params: data
          });
        },
        //地点详情
        etailEcologySite:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/site_detailEcologySite',
              params: data
          });
        },
        //生态地点中相关帖子列表
        corrlateEcologyCirclePostList:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/site_correlateEcologyCirclePostList',
              params: data
          });
        },
        //生态地点中评论列表
        ecologySiteCommentList:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/site_ecologySiteCommentList',
              params: data
          });
        },
        //生态地点添加评论
        addEcologySiteComment:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/site_addEcologySiteComment',
              params: data
          });
        },
        //生态地点图片列表
        ecologySitePictureList:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/site_ecologySitePictureList',
              params: data
          });
        },
        //生态地点添加图片
        addEcologySitePicture:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/site_addEcologySitePicture',
              params: data
          });
        },
        //生态地点添加举报
        addEcologySiteReport:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/site_addEcologySiteReport',
              params: data
          });
        },
        //修改生态地点
        updateEcologySite:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/site_updateEcologySite',
              params: data
          });
        },
        //添加圈子
        addEcologyCircle:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/circle_addEcologyCircle',
              params: data
          });
        },
        //圈子列表
        CircleList:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/circle_ecologyCircleList',
              params: data
          });
        },
        //申请加入圈子
        addCircle:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/circle_addEcologyCircleUser',
              params: data
          });
        },
        //退出圈子
        exitCircle:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/circle_exitEcologyCircleUser',
              params: data
          });
        },
        //我的圈子
        myCircleList:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/circle_myEcologyCircleList',
              params: data
          });
        },
        //可能感兴趣的圈子
        randCircleList:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/circle_randEcologyCircleList',
              params: data
          });
        },
        //圈子详情
        detailCircle:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/circle_detailEcologyCircle',
              params: data
          });
        },
        //发布帖子
        addEcologyCirclePost:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/circle_addEcologyCirclePost',
              params: data
          });
        },
        //帖子列表
        postList:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/circle_ecologyCirclePostList',
              params: data
          });
        },
        //帖子详情
        detailEcologyCirclePost:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/circle_detailEcologyCirclePost',
              params: data
          });
        },
        //帖子评论列表
        ecologyCirclePostCommentList:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/circle_ecologyCirclePostCommentList',
              params: data
          });
        },
        //帖子添加评论
        addEcologyCirclePostComment:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/circle_addEcologyCirclePostComment',
              params: data
          });
        },
        //修改帖子
        updateEcologyCirclePost:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/circle_updateEcologyCirclePost',
              params: data
          });
        },
        //修改密码
        changepwd:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/user_updatePassword',
              params: data
          });
        },
        //检测是否是最新版本
        Version:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/system_getSysAppVersion',
              params: data
          });
        },
        // 私信
        sendChat:function(data){
          return $http({　
              method: 'POST',
              url:xingzheUrl + '/client/chat_sendEcologyChatRecord',
              params: data
          });
        },
        // 消息列表
        chatList:function(data){
          return $http({　
              method: 'POST',
              url:xingzheUrl + '/client/chat_ecologyChatList',
              params: data
          });
        },
        // 聊天详情
        chatDetail:function(data){
          return $http({　
              method: 'POST',
              url:xingzheUrl + '/client/chat_ecologyChatRecordList',
              params: data
          });
        },
        //查询未读消息条数
        chatCount:function(data){
          return $http({　
              method: 'POST',
              url: xingzheUrl + '/client/chat_ecologyChatCount',
              params: data
          });
        },
        //坐标转换
        lngLat:function(data){
          return $http({　
              method: 'GET',
              url:'http://restapi.amap.com/v3/assistant/coordinate/convert',
              params: data
          });
        }
  };
});
