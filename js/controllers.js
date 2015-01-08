'use strict';

/* Controllers */
//var apiBaseUrl = 'http://m.nailaohui.com/api/v2/';
// var apiBaseUrl = 'http://m.nailaohui.com/api/v2/';
var apiBaseUrl = (CURRENT_ENV=='PRODUCTION') ? 'http://m.nailaohui.com/api/v2/' : 'http://zl.nailaohui.com/api/v2/';

//var apiBaseUrl = 'http://192.168.1.29/api/v2/';
// var apiBaseUrl = 'http://192.168.1.29/api/v2/';
  var apiBaseUrl = 'http://zl.nailaohui.com/api/v2/';
// var apiBaseUrl = 'http://download.nailaohui.com/api/v2/';
// var apiBaseUrl = 'http://m.nailaohui.com/api/v2/';



angular.module('nailaohuiApp.controllers', [])
  // 所有页面的父controller
  .controller('PageCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', function($scope, $http, $rootScope, toastAlert) {
    // 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
    document.addEventListener('WeixinJSBridgeReady', function() {
      var WJ = WeixinJSBridge;
      // 发送给好友
      WJ.on('menu:share:appmessage', function() {
          WJ.invoke('sendAppMessage', $rootScope.weixin_config, function(res) {
            // _report('sendAppMessage', res.err_msg);
            // alert('发送给朋友了');
          });
      });
      // 发送到朋友圈
      WJ.on('menu:share:timeline', function() {
          WJ.invoke('shareTimeline', $rootScope.weixin_config, function(res) {
            // _report('shareTimeline', res.err_msg);
            // alert('发送给朋友圈了');
          });
      });

      // 发送到微博
      WJ.on('menu:share:weibo', function() {
          WJ.invoke('shareWeibo', $rootScope.weixin_config, function(res) {
            // _report('shareWeibo', res.err_msg);
          });
      });
    });

    if (navigator.userAgent.indexOf('MicroMessenger') != -1) {
      $rootScope.is_weixin = true;  
    };
    
    $rootScope.opts = {};

    $scope.$on('$routeChangeStart', function () {
      toastAlert.loading();
      $rootScope.opts = {};
    });
    $scope.$on('$routeChangeSuccess', function() {
      $rootScope.weixin_config = {
        // 如果是正常的网页分享，则不要添加。否则会出现未审核应用
        appid: 'wx6bd626b3e369f97f', // 公共账号ID？
        img_url: 'http://photobucket.oss-cn-hangzhou.aliyuncs.com/wap/logo.png',
        img_width: '50',
        img_height: '50',
        link: 'http://m.nailaohui.com',
        desc: '漂泊在举目无亲的异乡，厌倦了都市的喧嚣，加入我们找到情投意合的知己！',
        title: '奶酪汇，浪漫你的旅行！'
      };
    });
  }])
  // 首页controller
  .controller('HomeCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', function($scope, $http, $rootScope, toastAlert) {
    
    $rootScope.top_title = '';

    
    $scope.$on('$routeChangeSuccess', function () {
      toastAlert.load_complete();
    });
    $scope.go_user_center = function () {
      if (!$rootScope.is_login) {
        toastAlert.alert('没有登录！');
      } else {
        window.location.href = '#/order/index';
      }
    };
    $scope.not_finish_yet = function () {
      toastAlert.alert('敬请期待~');
    };
  }])
  // 奶酪时间
  .controller('CheeseIndexCtrl', ['$scope', '$http', '$routeParams', '$location', '$rootScope', 'toastAlert', 'Cheese', function($scope, $http, $routeParams, $location, $rootScope, toastAlert, Cheese) {
    $rootScope.top_title = '奶酪时间';
    $scope.cheese = new Cheese();
  }])
  .controller('CheeseShowCtrl', ['$scope', '$sce', '$http', '$routeParams', '$rootScope', 'toastAlert', 'Comment', function($scope, $sce, $http, $routeParams, $rootScope, toastAlert, Comment) {
    $rootScope.top_title = '奶酪时间';

    $scope.comment = new Comment;
    $scope.comment.comment_type = 'cheese';
    $scope.comment.be_commented = $routeParams.cheese_id;

    // 新的评论
    $scope.comment_click = function () {
      if (!$rootScope.is_login) {
        if (confirm('登录后才可以评论哦~')) {
          window.location.href = '#/user/login';
        } else {
          return;
        }
      };
      $scope.comment.comment_content = '';
      $scope.comment.comment_id = '';
      angular.element('.page_cover').show();
      angular.element('.new_comment_container').show();
    };
    // 取消评论
    $scope.form_cancel = function () {
      angular.element('.page_cover').hide();
      angular.element('.new_comment_container').hide();
    };
    // 回复评论
    $scope.reply = function (be_replied_comment) {
      if (!$rootScope.is_login) {
        if (confirm('登录后才可以评论哦~')) {
          window.location.href = '#/user/login';
        } else {
          return;
        }
      };
      // todo 如果是自己的回复的话  就删除
      if (be_replied_comment.comment_user.user_id == $rootScope.user.user_id) {
        return;
        // if (confirm('确认删除评论吗~')) {
        //   $scope.comment.delete($scope.comment); 
        // };
      };
      angular.element('.new_comment_textarea').attr('placeholder', '回复'+be_replied_comment.comment_user.user_nickname+'：');
      $scope.comment.comment_id = be_replied_comment.comment_id;
      angular.element('.page_cover').show();
      angular.element('.new_comment_container').show();
    }
    // 评论
    $scope.form_submit = function () {
      angular.element('.page_cover').hide();
      angular.element('.new_comment_container').hide();
      $scope.comment.new($scope.comment);  
    }

    $http.get(apiBaseUrl+'cheese/getjson?cheese_id='+$routeParams.cheese_id, {cache: true}).success(function(data) {
      $scope.cheese = data['info']['main_content'];
      $rootScope.weixin_config = {
        // 如果是正常的网页分享，则不要添加。否则会出现未审核应用
        appid: 'wx6bd626b3e369f97f', // 公共账号ID？
        img_url: $scope.cheese.cheese_cover,
        img_width: '50',
        img_height: '50',
        link: 'http://m.nailaohui.com/#/cheese/show/'+$routeParams.cheese_id,
        desc: $scope.cheese.cheese_brief,
        title: $scope.cheese.cheese_title
      };
      $scope.cheese_content = function() {
        return $sce.trustAsHtml($scope.cheese.cheese_content);
      };
      toastAlert.load_complete();
    });
  }])
  .controller('ExamIndexCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', 'Post', '$sce', function($scope, $http, $rootScope, toastAlert, Post, $sce) {
    $scope.$on('$routeChangeSuccess', function () {
      toastAlert.load_complete();
      $rootScope.weixin_config = {
        // 如果是正常的网页分享，则不要添加。否则会出现未审核应用
        appid: 'wx6bd626b3e369f97f', // 公共账号ID？
        img_url: 'http://photobucket.oss-cn-hangzhou.aliyuncs.com/wap/weixin_chugui.png',
        img_width: '50',
        img_height: '50',
        link: 'http://m.nailaohui.com/#/exam/index',
        desc: '在爱情里，你能抵制住诱惑吗？有些人（文章）看似专一，心里却藏着其他心思；',
        title: '准哭了，快来测试你出轨的概率有多大！'
      };
    });
    $scope.button_width = angular.element(window).width()-20;
    $scope.start = function () {
      window.location.href = '#/exam/step/0';
    }
  }])
  .controller('ExamStepCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', 'Post', '$sce', '$routeParams', function($scope, $http, $rootScope, toastAlert, Post, $sce, $routeParams) {
    $scope.$on('$routeChangeSuccess', function () {
      toastAlert.load_complete();
      $rootScope.weixin_config = {
        // 如果是正常的网页分享，则不要添加。否则会出现未审核应用
        appid: 'wx6bd626b3e369f97f', // 公共账号ID？
        img_url: 'http://photobucket.oss-cn-hangzhou.aliyuncs.com/wap/weixin_chugui.png',
        img_width: '150',
        img_height: '150',
        link: 'http://m.nailaohui.com/#/exam/index',
        desc: '在爱情里，你能抵制住诱惑吗？有些人（文章）看似专一，心里却藏着其他心思；',
        title: '准哭了，我的出轨概率是'+$scope.point+'% 快来测测你出轨的概率多大！'
      };
    });
    $scope.button_width = angular.element(window).width()-20;
    $scope.done = ("ABCDEFabcdef".indexOf($routeParams.step)!=-1);

    var step = $scope.step = $routeParams.step;
    var test_json = {"total":"12","exam":[{"title":"\u6709\u4e00\u4e2a\u5c0f\u5973\u5b69\u7684\u540d\u5b57\u53eb\u82ad\u6bd4\uff0c\u56e0\u4e3a\u5bb6\u91cc\u5f88\u7a77\uff0c\u6240\u4ee5\u73a9\u5177\u53ea\u6709\u4e00\u4e2a\uff1a\u4e00\u53ea\u5c0f\u7ed2\u5e03\u505a\u7684\u73a9\u5177\u5c0f\u718a\u3002\u4f60\u8ba4\u4e3a\u82ad\u6bd4\u662f\u5982\u4f55\u5f97\u5230\u8fd9\u4e2a\u73a9\u5177\u7684\u5462\uff1f","option":[{"content":"\u4ece\u5783\u573e\u573a\u6361\u6765\u7684","jump_to":"1"},{"content":"\u5988\u5988\u5e2e\u5979\u505a\u7684","jump_to":"2"}]},{"title":"\u6709\u4e00\u5929\uff0c\u82ad\u6bd4\u7684\u7238\u7238\u56de\u5bb6\uff0c\u9ad8\u5174\u5730\u5bf9\u5bb6\u4eba\u8bf4:\u201c\u6211\u8d5a\u5230\u4e00\u7b14\u5927\u94b1\u4e86!\u201d \u4f60\u8ba4\u4e3a\u82ad\u6bd4\u7684\u7238\u7238\u662f\u600e\u6837\u5f97\u5230\u8fd9\u7b14\u94b1\u7684\u5462?","option":[{"content":"\u4e70\u516c\u76ca\u5956\u5238\u4e2d\u4e86\u5927\u5956","jump_to":"3"},{"content":"\u4ed6\u6240\u53d1\u660e\u7684\u4e1c\u897f\u5927\u5356","jump_to":"4"}]},{"title":"\u6709\u4e00\u5929,\u82ad\u6bd4\u7684\u7238\u7238\u56de\u5bb6\uff0c\u9ad8\u5174\u5730\u5bf9\u5bb6\u4eba\u8bf4:\u201c\u6211\u8d5a\u5230\u4e00\u7b14\u5927\u94b1\u4e86!\u201d \u4f60\u8ba4\u4e3a\u8fd9\u7b14\u94b1\u7684\u91d1\u989d\u5927\u7ea6\u4f1a\u662f\u591a\u5c11?","option":[{"content":"\u53ef\u4ee5\u4e00\u8f88\u5b50\u4e0d\u5de5\u4f5c\uff0c\u5230\u5904\u6e38\u5c71\u73a9\u6c34","jump_to":"4"},{"content":"\u53ef\u4ee55\u5e74\u4e0d\u5de5\u4f5c","jump_to":"5"}]},{"title":"\u7ed3\u679c\u82ad\u6bd4\u53d8\u6210\u4e86\u6709\u94b1\u4eba\u5bb6\u7684\u5c0f\u59d0\uff0c\u5979\u7684\u7238\u7238\u5988\u5988\u4e70\u4e86\u8bb8\u591a\u73a9\u5177\u7ed9\u5979\u3002\u4f60\u60f3\u4ed6\u4f1a\u6700\u559c\u6b22\u4e0b\u9762\u90a3\u4e00\u4e2a\u73a9\u5177\u5462?","option":[{"content":"\u6cd5\u56fd\u6d0b\u5a03\u5a03","jump_to":"6"},{"content":"\u5bb6\u5bb6\u9152\u6e38\u620f\u7ec4","jump_to":"7"}]},{"title":"\u82ad\u6bd4\u53d8\u6210\u4e86\u6709\u94b1\u4eba\u5bb6\u7684\u5c0f\u59d0\uff0c\u7238\u7238\u5988\u5988\u4e70\u4e86\u8bb8\u591a\u73a9\u5177\u7ed9\u5979\u3002\u7ad9\u5728\u4e00\u5806\u65b0\u73a9\u5177\u524d\uff0c\u82ad\u6bd4\u5583\u5583\u81ea\u8bed\u8bf4\u4e86\u54ea\u53e5\u8bdd?","option":[{"content":"\u5e94\u8be5\u5148\u73a9\u90a3\u4e2a\u5462?","jump_to":"6"},{"content":"\u771f\u4e0d\u6562\u76f8\u4fe1\uff0c\u597d\u8c61\u5728\u505a\u68a6","jump_to":"8"}]},{"title":"\u82ad\u6bd4\u53d8\u6210\u4e86\u6709\u94b1\u4eba\u5bb6\u7684\u5c0f\u59d0\uff0c\u7238\u7238\u5988\u5988\u4e70\u4e86\u5f88\u591a\u73a9\u5177\u7ed9\u5979,\u4e0d\u8fc7\u5176\u5b9e\u5979\u8fd8\u6709\u4e00\u4e2a\u613f\u671b\u3002\u4f60\u60f3\u4f1a\u662f\u4e0b\u9762\u90a3\u4e00\u4e2a\u5462?","option":[{"content":"\u60f3\u4e70\u65b0\u8863\u670d","jump_to":"7"},{"content":"\u5168\u5bb6\u4e00\u8d77\u5230\u9ad8\u7ea7\u9910\u5385\u7528\u9910","jump_to":"8"}]},{"title":"\u6709\u4e00\u5929\u665a\u4e0a\uff0c\u5f53\u82ad\u6bd4\u6b63\u5728\u6f02\u4eae\u7684\u65b0\u5bb6\u7761\u5f97\u9999\u751c\u7684\u65f6\u5019,\u88ab\u653e\u5728\u623f\u91cc\u89d2\u843d\u7684\u718a\u5b9d\u5b9d\u7a81\u7136\u7ad9\u4e86\u8d77\u6765\uff0c\u6162\u6162\u8d70\u5411\u82ad\u6bd4\u3002\u4f60\u89c9\u5f97\u5f53\u65f6\u718a\u5b9d\u5b9d\u8138\u4e0a\u7684\u8868\u60c5\u4f1a\u662f\u5982\u4f55\u7684\u5462?","option":[{"content":"\u7b11\u7684\u5f88\u60b2\u4f24","jump_to":"9"},{"content":"\u54ed\u6ce3\u7740","jump_to":"10"}]},{"title":"\u6709\u4e00\u5929\u665a\u4e0a,\u5f53\u82ad\u6bd4\u6b63\u5728\u6f02\u4eae\u7684\u65b0\u5bb6\u7761\u5f97\u9999\u751c\u7684\u65f6\u5019,\u88ab\u653e\u5728\u623f\u91cc\u89d2\u843d\u7684\u718a\u5b9d\u5b9d\u7a81\u7136\u7ad9\u4e86\u8d77\u6765\uff0c\u6162\u6162\u8d70\u5411\u82ad\u6bd4\uff0c\u7a81\u7136\u6478\u4e86\u4e00\u4e0b\u5979\u3002\u4f60\u89c9\u5f97\u5b83\u4f1a\u6478\u54ea\u4e2a\u90e8\u4f4d\u5462?","option":[{"content":"\u8138\u988a","jump_to":"9"},{"content":"\u80a9\u8180","jump_to":"11"}]},{"title":"\u6709\u4e00\u5929\u665a\u4e0a,\u5f53\u82ad\u6bd4\u6b63\u5728\u6f02\u4eae\u7684\u65b0\u5bb6\u7761\u5f97\u9999\u751c\u7684\u65f6\u5019,\u88ab\u653e\u5728\u623f\u91cc\u89d2\u843d\u7684\u718a\u5b9d\u5b9d\u7a81\u7136\u7ad9\u4e86\u8d77\u6765\uff0c\u6162\u6162\u8d70\u5411\u82ad\u6bd4\uff0c\u5bf9\u5979\u8bf4\u4e86\u4e00\u53e5\u8bdd\u3002\u5b83\u8bf4\u4e86\u4ec0\u4e48\u8bdd?","option":[{"content":"\u592a\u597d\u4e86\uff0c\u82ad\u6bd4","jump_to":"10"},{"content":"\u592a\u8fc7\u5206\u4e86\uff0c\u82ad\u6bd4","jump_to":"11"}]},{"title":"\u5f53\u82ad\u6bd4\u9192\u6765\u65f6\uff0c\u718a\u5b9d\u5b9d\u5df2\u7ecf\u4e0d\u5728\u4e86\u3002\u4e4b\u540e\u4f60\u60f3\u82ad\u6bd4\u4f1a\u600e\u4e48\u505a?","option":[{"content":"\u5979\u5e76\u6ca1\u53d1\u73b0,\u6240\u4ee5\u4ec0\u4e48\u4e5f\u6ca1\u505a","jump_to":"A"},{"content":"\u8d76\u7d27\u8dd1\u51fa\u53bb\u627e\u718a\u5b9d\u5b9d","jump_to":"B"}]},{"title":"\u5f53\u82ad\u6bd4\u9192\u6765\u65f6\uff0c\u718a\u5b9d\u5b9d\u5df2\u7ecf\u4e0d\u5728\u4e86\u3002\u4f60\u8ba4\u4e3a\u718a\u5b9d\u5b9d\u7684\u771f\u6b63\u8eab\u4efd\u662f\u4ec0\u4e48\uff1f","option":[{"content":"\u80fd\u4e3a\u4e3b\u4eba\u5e26\u6765\u597d\u8fd0\u7684\u9b54\u6cd5\u718a\u5b9d\u5b9d","jump_to":"C"},{"content":"\u5929\u4f7f\u5316\u8eab\u7684\u718a\u5b9d\u5b9d","jump_to":"D"}]},{"title":"\u5f53\u82ad\u6bd4\u9192\u6765\u65f6\uff0c\u718a\u5b9d\u5b9d\u5df2\u7ecf\u4e0d\u5728\u4e86\u3002\u4f60\u8ba4\u4e3a\u82ad\u6bd4\u7684\u5bb6\u4f1a\u53d8\u6210\u4ec0\u4e48\u6837\u5b50\u5462\uff1f","option":[{"content":"\u4f9d\u65e7\u5f88\u6709\u94b1\uff0c\u4f46\u5bb6\u4eba\u5173\u7cfb\u53d8\u7684\u5f88\u574f\uff0c\u7ecf\u5e38\u5435\u67b6","jump_to":"E"},{"content":"\u53c8\u6062\u590d\u5230\u539f\u6765\u7834\u65e7\u7684\u5c0f\u5c4b","jump_to":"F"}]}]};
    // alert($scope.test_json.exam[step].title);
    if (!$scope.done) {
      $scope.title = test_json.exam[step].title;
      $scope.options = test_json.exam[step].option;
    } else {
      switch (step) {
        case 'B':
          $scope.point = Math.floor(Math.random() * (90 - 70 + 1)) + 70;
          break;
        case 'C':
          $scope.point = Math.floor(Math.random() * (70 - 50 + 1)) + 50;
          break;
        case 'D':
          $scope.point = Math.floor(Math.random() * (50 - 30 + 1)) + 30;
          break;
        case 'E':
          $scope.point = Math.floor(Math.random() * (30 - 20 + 1)) + 20;
          break;
        case 'F':
          $scope.point = Math.floor(Math.random() * (10 - 0 + 1)) + 0;
          break; 
        
        default:
          $scope.point = Math.floor(Math.random() * (100 - 90 + 1)) + 90;
          break;
      }
        
    }
    
    $scope.weixin_share = function () {
      angular.element('#top_image').css('display', 'block');
      // 遮挡
      angular.element('.page_cover').css('display', 'block');
    }
    // 遮挡的事件
    $scope.hide_cover = function () {
      angular.element('.page_cover').hide();
      angular.element('#top_image').hide();
    }
  }])
  // 奶酪广场
  .controller('PostIndexCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', 'Post', '$sce', function($scope, $http, $rootScope, toastAlert, Post, $sce) {
    $rootScope.top_title = '奶酪广场';
    $rootScope.opts = {new_post: true, not_follow_wechat: true};

    $scope.posts = new Post();
    
    $scope.like = function (post) {
      if (post.is_like) {
        $http.get(apiBaseUrl+'like/delete?like_type=post&post_id='+post.post_id+'&session_token='+$rootScope.session_token).success(function (data) {
          if (data.result) {
            post.like_num--;
            post.is_like = !post.is_like;
          }
        });
      } else {
        $http.get(apiBaseUrl+'like/new?like_type=post&post_id='+post.post_id+'&session_token='+$rootScope.session_token).success(function (data) {
          if (data.result) {
            post.like_num++;
            post.is_like = !post.is_like;
          }
        });
      }
    }
  }])
  .controller('AppDownloadCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', '$upload', function($scope, $http, $rootScope, toastAlert, $upload) {
    $scope.$on('$routeChangeSuccess', function () {
      toastAlert.load_complete();
    });
    $rootScope.weixin_config = {
      // 如果是正常的网页分享，则不要添加。否则会出现未审核应用
      appid: 'wx6bd626b3e369f97f', // 公共账号ID？
      img_url: 'http://photobucket.oss-cn-hangzhou.aliyuncs.com/wap/logo.png',
      img_width: '50',
      img_height: '50',
      link: 'http://nailaohui.com/download/',
      desc: '漂泊在举目无亲的异乡，厌倦了都市的喧嚣，加入我们找到情投意合的知己！',
      title: '奶酪汇，浪漫你的旅行！'  
    }
    $scope.weixin_download = function () {
      angular.element('#top_image').css('display', 'block');
      // 遮挡
      angular.element('.page_cover').css('display', 'block');
    }
    // 遮挡的事件
    $scope.hide_cover = function () {
      angular.element('.page_cover').hide();
      angular.element('#top_image').hide();
    }
  }])
  // 奶酪广场，发表新帖子
  .controller('PostNewCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', '$upload', 'Post', function($scope, $http, $rootScope, toastAlert, $upload, Post) {
    $rootScope.top_title = '奶酪广场';
    $scope.post = new Post();
    $scope.post.images = [];
    $scope.upload_images = true;
    $scope.send_face = false;
    $scope.send_image_icon = {'enable': '/images/wap/fatu@2x.png', 'disable': '/images/wap/fatu2@2x.png'};
    $scope.send_face_icon = {'enable': '/images/wap/biaoqing2@2x.png', 'disable': '/images/wap/biaoqing@2x.png'};
    $scope.image_icon = $scope.send_image_icon.enable;
    $scope.face_icon = $scope.send_face_icon.disable;

    $scope.$on('$routeChangeSuccess', function () {
      toastAlert.load_complete();
    });
    $scope.cancel = function () {
      window.location.href = '#/post/index';
    }
    // 切换表情和上传图片的标签
    $scope.send_face_click = function () {
      $scope.send_face = true;
      $scope.upload_images = !$scope.send_face;
      $scope.image_icon = $scope.upload_images ? $scope.send_image_icon.enable : $scope.send_image_icon.disable;
      $scope.face_icon = $scope.send_face ? $scope.send_face_icon.enable : $scope.send_face_icon.disable;
    }
    $scope.send_images_click = function () {
      $scope.send_face = false;
      $scope.upload_images = !$scope.send_face;
      $scope.image_icon = $scope.upload_images ? $scope.send_image_icon.enable : $scope.send_image_icon.disable;
      $scope.face_icon = $scope.send_face ? $scope.send_face_icon.enable : $scope.send_face_icon.disable;
    }
    // 提交表单
    $scope.submit = function () {
      if ($scope.post.loading) {return;};
      $scope.post.loading = true;
      $http.post(apiBaseUrl+'post/create', $scope.post, {cache: true}).success(function(data) {
        $scope.post.loading = false;
        // 操作成功
        if (data.result) {
          toastAlert.alert('操作成功！', function() {
            window.location.href = '#/post/index';  
          });
        } else {
          toastAlert.alert(data.message);
        }
        toastAlert.load_complete();
      });
    };
    // 上传图片
    $scope.onFileSelect = function($files) {
      //$files: an array of files selected, each file has name, size, and type.
      // console.log($files)
      if ($files.length > 6) {
        toastAlert.alert('最多只能上传6张照片~');
        return;
      };
      
      for (var i = 0; i < $files.length; i++) {
        var file = $files[i];
        $scope.upload = $upload.upload({
          url: apiBaseUrl+'post/upload?session_token='+$rootScope.session_token, //upload.php script, node.js route, or servlet url
          //method: 'POST' or 'PUT',
          //headers: {'header-key': 'header-value'},
          //withCredentials: true,
          data: {myObj: $scope.myModelObj},
          file: file, // or list of files ($files) for html5 only
          //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
          // customize file formData name ('Content-Disposition'), server side file variable name. 
          //fileFormDataName: myFile, //or a list  of names for multiple files (html5). Default is 'file' 
          // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
          //formDataAppender: function(formData, key, val){}
        }).progress(function(evt) {
          // console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function(data, status, headers, config) {
          // file is uploaded successfully
          // 操作成功
          if (data.result) {
            $scope.post.images.unshift({url: data.info.main_content.url+'?imageView/1/w/100/h/100'});
          } else {
            toastAlert.alert(data.message);
          }
        }).error(function () {
          toastAlert.alert('系统繁忙，请稍后再试！');          
        });
      }
    };

  }])
  // 奶酪广场，详情
  .controller('PostShowCtrl', ['$scope', '$sce', '$http', '$routeParams', '$rootScope', 'toastAlert', 'Comment', function($scope, $sce, $http, $routeParams, $rootScope, toastAlert, Comment) {
    $rootScope.top_title = '奶酪广场';
    
    $http.get(apiBaseUrl+'post/show?post_id='+$routeParams.post_id, {cache: true}).success(function(data) {
      $scope.post = data['info']['main_content'];
    });
    
    $scope.$on('$routeChangeSuccess', function () {
      toastAlert.load_complete();
    });
    $scope.comment = new Comment;
    $scope.comment.comment_type = 'post';
    $scope.comment.be_commented = $routeParams.post_id;

    // 新的评论
    $scope.comment_click = function () {
      if (!$rootScope.is_login) {
        if (confirm('登录后才可以评论哦~')) {
          window.location.href = '#/user/login';
        } else {
          return;
        }
      };
      $scope.comment.comment_content = '';
      $scope.comment.comment_id = '';
      angular.element('.page_cover').show();
      angular.element('.new_comment_container').show();
    };
    // 取消评论
    $scope.form_cancel = function () {
      angular.element('.page_cover').hide();
      angular.element('.new_comment_container').hide();
    };
    // 回复评论
    $scope.reply = function (be_replied_comment) {
      if (!$rootScope.is_login) {
        if (confirm('登录后才可以评论哦~')) {
          window.location.href = '#/user/login';
        } else {
          return;
        }
      };
      // todo 如果是自己的回复的话  就删除
      if (be_replied_comment.comment_user.user_id == $rootScope.user.user_id) {
        return;
        // if (confirm('确认删除评论吗~')) {
        //   $scope.comment.delete($scope.comment); 
        // };
      };
      angular.element('.new_comment_textarea').attr('placeholder', '回复'+be_replied_comment.comment_user.user_nickname+'：');
      $scope.comment.comment_id = be_replied_comment.comment_id;
      angular.element('.page_cover').show();
      angular.element('.new_comment_container').show();
    }
    // 评论
    $scope.form_submit = function () {
      angular.element('.page_cover').hide();
      angular.element('.new_comment_container').hide();
      $scope.comment.new($scope.comment);  
    }
    $scope.like = function (post) {
      if (post.is_like) {
        $http.get(apiBaseUrl+'like/delete?like_type=post&post_id='+post.post_id+'&session_token='+$rootScope.session_token).success(function (data) {
          if (data.result) {
            post.like_num--;
            post.is_like = !post.is_like;
          }
        });
      } else {
        $http.get(apiBaseUrl+'like/new?like_type=post&post_id='+post.post_id+'&session_token='+$rootScope.session_token).success(function (data) {
          if (data.result) {
            post.like_num++;
            post.is_like = !post.is_like;
          }
        });
      }
    };
  }])
  // 个人中心，登录
  .controller('UserLoginCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', 'session', function($scope, $http, $rootScope, toastAlert, session) {
    $rootScope.top_title = '';
    $scope.user = {};
    $scope.$on('$routeChangeSuccess', function () {
      toastAlert.load_complete();
    });
    $scope.submit = function () {
      if ($scope.is_loading) {return;};

      if (!$scope.user.username) {toastAlert.alert('用户名不能为空！');return;};
      if (!$scope.user.password) {toastAlert.alert('密码不能为空！');return;};

      // 发起登录请求
      $scope.is_loading = true;
      toastAlert.loading();
      $http.post(apiBaseUrl+'user/login', {
        'login_type': 'username',
        'user_username': $scope.user.username,
        'user_password': $scope.user.password,
      }).success(function (data) {
        $scope.is_loading = false;
        toastAlert.load_complete();
        // 登录成功
        if (data.result) {
          session.login(data.info.main_content);
          // 跳转
          if ($rootScope.jump_url) {
            window.location.href = $rootScope.jump_url;
            $rootScope.jump_url= '';
          } else {
            window.location.href = '#/home';
          }
        } else {
          toastAlert.alert(data.message);  
        }
      });
    };
  }])
  // 页面顶部
  .controller('HeaderCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', '$cookies', function($scope, $http, $rootScope, toastAlert, $cookies) {
    $scope.new_post = function () {
      // 判断用户是否登录
      if ($rootScope.is_login) {
        // 判断用户的基本资料是否齐全
        if (!$rootScope.is_profile_complete) {
          if (confirm("完善基本资料后才可以和小伙伴们愉快的玩耍哦~")) {
            window.location.href = '#/user/update';
          } else {
            return false;
          }
        }
        window.location.href = '#/post/new';
      } else {
        if (confirm("登录后才可以发表，现在去登录吗？")) {
          window.location.href = '#/user/login';
        }
      }

    }
  }])
  // 页面底部，登录
  .controller('FooterCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', '$cookies', 'session', function($scope, $http, $rootScope, toastAlert, $cookies, session) {
    session.init();
    $scope.logout = function () {
      session.logout();
    }
  }])
  // 个人中心，注册
  .controller('UserRegisterCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', function($scope, $http, $rootScope, toastAlert) {
    $rootScope.top_title = '';
    $scope.is_loading = false;
    $scope.user = {};
    $scope.$on('$routeChangeSuccess', function () {
      toastAlert.load_complete();
    });
    // 获取验证码
    $scope.get_verifiy_code = function () {

        

      if ($scope.is_loading) {return;};
      if ($scope.user.mobile) {
        $scope.is_loading = true;
        // 发起登录请求
        $http.post(apiBaseUrl+'user/verify', {
          'type': 'register',
          'user_mobile': $scope.user.mobile,
        }).success(function (data) {
          $scope.is_loading = false;
          if (data.result) {
            // 验证码发送成功，倒计时开始
            var verify_button = angular.element('.get_verify_code');
            verify_button.addClass('btn-disable').attr('disabled', true);
            $scope.countdown = 60;
            var timer = setInterval(function() {
              if ($scope.countdown > 0) {
                verify_button.html($scope.countdown+' 秒');
                $scope.countdown --;
              } else {
                verify_button.html('获取');
                verify_button.removeClass('btn-disable').attr('disabled', false);;
                clearInterval(timer);
              }
            }, 1000);
          };
          toastAlert.alert(data.message);
        });
      } else {
        // 提示用户名或密码不能为空
        toastAlert.alert('手机号不能为空！');
      }
    }
    // 注册
    $scope.submit = function () {
      if ($scope.is_loading) {return;};
      if (!$scope.user.mobile) {toastAlert.alert('手机号不能为空！');return;};
      if (!$scope.user.verify_code) {toastAlert.alert('验证码不能为空！');return;};
      if (!$scope.user.nickname) {toastAlert.alert('昵称不能为空！');return;};
      if (!$scope.user.password) {toastAlert.alert('密码不能为空！');return;};

      // 发起注册请求
      $scope.is_loading = true;
      toastAlert.loading()
      $http.post(apiBaseUrl+'user/register', {
        'user_mobile': $scope.user.mobile,
        'user_password': $scope.user.password,
        'user_nickname': $scope.user.nickname,
        'verify_code': $scope.user.verify_code,
      }).success(function (data) {
        $scope.is_loading = false;
        // 注册成功
        if (data.result) {
          // 将session token 保存到cookie
          var d = new Date();
          d.setTime(d.getTime() + (30*24*60*60*1000));
          document.cookie = 'session_token='+data.info.main_content.session_token+';expires='+d.toUTCString()+';path=/';
          document.cookie = 'user_nickname='+data.info.main_content.user_nickname+';expires='+d.toUTCString()+';path=/';
          document.cookie = 'user_id='+data.info.main_content.user_id+';expires='+d.toUTCString()+';path=/';
          $rootScope.user = {'session_token': data.info.main_content.session_token,'nickname' :data.info.main_content.user_nickname, 'user_id' :data.info.main_content.user_id};
          $rootScope.is_login = true;
          // 跳转
          if ($rootScope.jump_url) {
            window.location.href = $rootScope.jump_url;
          } else {
            window.location.href = '#/home';
          }
        } else {
          toastAlert.alert(data.message);  
        }
      });
    };
  }])
  // 个人中心，忘记密码
  .controller('UserForgetCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', function($scope, $http, $rootScope, toastAlert) {
    $rootScope.top_title = '忘记密码';
    $scope.user = {};
    $scope.$on('$routeChangeSuccess', function () {
      toastAlert.load_complete();
    });
    $scope.submit = function () {
      if ($scope.is_loading) {return;};
      if (!$scope.user.mobile) {toastAlert.alert('手机号不能为空！');return;};
      if (!$scope.user.verify_code) {toastAlert.alert('手机号不能为空！');return;};
      if (!$scope.user.password) {toastAlert.alert('密码不能为空！');return;};

      // 发起登录请求
      $scope.is_loading = true;
      toastAlert.loading();
      $http.post(apiBaseUrl+'user/forgetpassword', {
        'login_type': 'username',
        'user_mobile': $scope.user.mobile,
        'verify_code': $scope.user.verify_code,
        'user_password': $scope.user.password,
      }).success(function (data) {
        $scope.is_loading = false;
        // 修改成功
        if (data.result) {
          // 跳转到登录页面
          window.location.href = '#/user/login';
        } else {
          toastAlert.alert(data.message);  
        }
      });
    };
  }])
  // 个人中心，查看个人资料
  .controller('UserShowCtrl', ['$scope', '$http', '$rootScope', '$routeParams', 'toastAlert', 'Post', function($scope, $http, $rootScope, $routeParams, toastAlert, Post) {
    $scope.show_profile = true;
    $scope.posts = new Post();
    $scope.posts.user_id = $routeParams.user_id;
    $scope.posts.user_post = true;

    $http.get(apiBaseUrl+'user/show?user_id='+$routeParams.user_id, {cache: true}).success(function(data) {
      $scope.user_info = data['info']['main_content'];
      
      toastAlert.load_complete();
    });
  }])
  // 个人中心，修改个人资料
  .controller('UserUpdateCtrl', ['$scope', '$http', '$rootScope', '$routeParams', 'toastAlert', 'Post', '$upload', function($scope, $http, $rootScope, $routeParams, toastAlert, Post, $upload) {
    if (!$rootScope.is_login) {
      toastAlert.alert('没有登录！', function () {
        window.history.go(-1);
      });
    } else {
      // 上传图片
      $scope.onFileSelect = function($files) {
        for (var i = 0; i < $files.length; i++) {
          var file = $files[i];
          $scope.upload = $upload.upload({
            url: apiBaseUrl+'user/upload', //upload.php script, node.js route, or servlet url
            //method: 'POST' or 'PUT',
            //headers: {'header-key': 'header-value'},
            //withCredentials: true,
            data: {myObj: $scope.myModelObj},
            file: file, // or list of files ($files) for html5 only
            //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
            // customize file formData name ('Content-Disposition'), server side file variable name. 
            //fileFormDataName: myFile, //or a list  of names for multiple files (html5). Default is 'file' 
            // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
            //formDataAppender: function(formData, key, val){}
          }).progress(function(evt) {
            // console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success(function(data, status, headers, config) {
            // file is uploaded successfully
            // 操作成功
            if (data.result) {
              // $scope..unshift({url: data.info.main_content.url+'?imageView/1/w/100/h/100'});
              $scope.user.user_small_picture = data.info.main_content.url+'?imageView/1/w/100/h/100';
              $scope.user.user_picture = data.info.main_content.url;
              angular.element('#user_avatar').attr({'ng-src':$scope.user.user_small_picture , 'src':$scope.user.user_small_picture});
            } else {
              toastAlert.alert(data.message);
            }
          }).error(function () {
            toastAlert.alert('系统繁忙，请稍后再试！');          
          });
        }
      };
      $http.get(apiBaseUrl+'user/show?user_id='+$rootScope.user.user_id).success(function(data) {
        $scope.user = data['info']['main_content'];
        angular.element('#user_avatar').attr({'ng-src':$scope.user.user_small_picture , 'src':$scope.user.user_small_picture});

        if ($scope.user.user_birthday) {
          var birthday = $scope.user.user_birthday.split('-');
          $scope.user.byear = birthday[0];
          $scope.user.bmonth = birthday[1];
          $scope.user.bday = birthday[2];
        };
        if ($scope.user.user_city_id) {
          $http.get(apiBaseUrl+'city/getcity?province_id='+$scope.user.user_province_id, {cache:true}).success(function(citys) {
            $scope.citys = citys.info.main_content;
            for (var i = $scope.citys.length - 1; i >= 0; i--) {
              if ($scope.citys[i].city_id == $scope.user.user_city_id) {
                $scope.user_city = $scope.citys[i];
              };
            };
          });
        };
        $scope.getCity = function () {
          $http.get(apiBaseUrl+'city/getcity?province_id='+$scope.user.user_province_id, {cache:true}).success(function(citys) {
            $scope.citys = citys.info.main_content;
            $scope.user.user_realname;
          });
        }
        // 提交表单
        $scope.submit = function () {
          if ($scope.loading) {return;};
          $scope.loading = true;
          // 将生日拼接起来
          $scope.user.user_birthday = $scope.user.byear+'-'+$scope.user.bmonth+'-'+$scope.user.bday;
          $scope.user.user_location_id = $scope.user_city.city_id;

          $http.post(apiBaseUrl+'user/update', $scope.user).success(function(data) {
            $scope.loading = false;
            // 操作成功
            if (data.result) {
              toastAlert.alert('操作成功！', function() {
              // todo 更新当前登录用户模型

                // window.history.go(-1);
              });
            } else {
              toastAlert.alert(data.message);
            }
            toastAlert.load_complete();
          });
        };
      });
    }

    $scope.$on('$routeChangeSuccess', function () {
      toastAlert.load_complete();
    });
  }])
  //查看个人动态
  .controller('UserDynamicCtrl', ['$scope', '$http', '$rootScope', '$routeParams' , 'toastAlert', function($scope, $http, $rootScope, $routeParams, toastAlert) {
    $rootScope.top_title = '奶酪广场';
    $rootScope.opts = {new_post: true};

    $http.get(apiBaseUrl+'post/index', {cache: true}).success(function(data) {
      $scope.posts = data['info']['main_content'];
      $scope.page = 2;
      toastAlert.load_complete();
    });

    $scope.is_loading = false;
    $scope.load_more = function () {
      if ($scope.is_loading) {
        return;
      };
      toastAlert.loading();
      $scope.is_loading = true;
      $http.get(apiBaseUrl+'post/index?page='+$scope.page, {cache: true}).success(function(data) {
        $scope.page += 1;

        $scope.is_loading = false;
        var new_page_list = data['info']['main_content'];
        for (var i =0; i < new_page_list.length; i++) {
          $scope.posts.push(new_page_list[i]);
        };
        toastAlert.load_complete();
      });
    };
  }])
  // 订单相关接口
  .controller('OrderNewCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', 'Tour', '$routeParams', function($scope, $http, $rootScope, toastAlert, Tour, $routeParams) {
    $rootScope.top_title = '确认订单';

    // 修改参团信息
    $scope.modify_join_info = function() {
      window.location.href = '#order/info';
      $rootScope.jump_url = '#/order/new/'+$routeParams.tour_id;
    }
    $http.get(apiBaseUrl+'order/new?tour_id='+$routeParams.tour_id).success(function(data) {
      toastAlert.load_complete();
      // 判断用户是否可以参加活动，没有头像是不允许参加活动的
      if (data['result']) {
        $scope.tour = data['info']['main_content']['tour_detail'];
       
        $scope.order = data['info']['main_content']['order_detail'];
        $scope.user = data['info']['main_content']['user_info'];
      } else if (data.error_code == "not_login") {
        // 没有登录
        toastAlert.alert('没有登录！', function () {
          $rootScope.jump_url = '#/order/new/'+$routeParams.tour_id;
          window.location.href = '#user/login';
        })
      } else if (data.error_code == "no_picture") {
        // 没传头像
        toastAlert.alert(data['message'], function () {
          window.location.href = '#user/update';
        });
      } else if (data.error_code == "not_set_join_info") {
        // 没设置参团信息
        toastAlert.alert(data['message'], function () {
          $rootScope.jump_url = '#/order/new/'+$routeParams.tour_id;
          window.location.href = '#order/info';
        });
      };
    });

    $scope.submit = function () {
      window.location.href = apiBaseUrl+'order/wappay?order_id='+$scope.order.order_id;
    };

  }])
  .controller('OrderSuccessCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', 'Tour', '$routeParams', function($scope, $http, $rootScope, toastAlert, Tour, $routeParams) {
    $rootScope.top_title = '支付成功';
    toastAlert.load_complete();
  }])
  .controller('OrderFailCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', 'Tour', '$routeParams', function($scope, $http, $rootScope, toastAlert, Tour, $routeParams) {
    $rootScope.top_title = '支付失败';
    toastAlert.load_complete();
  }])
  // 活动
  .controller('TourIndexCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', 'Tour', function($scope, $http, $rootScope, toastAlert, Tour) {
    $rootScope.top_title = '活动';
    $scope.tours = new Tour();
    $http.get(apiBaseUrl+'tour/tags', {cache: true}).success(function(data) {
      if(data.error_code == 'success'){
        $scope.tag = data['info']['main_content'];
      }
    });
  }])
  .controller('TourTagsCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', 'Tour', function($scope, $http, $rootScope, toastAlert, Tour) {
    $rootScope.top_title = '更多';
    $http.get(apiBaseUrl+'tour/tags', {cache: true}).success(function(data) {
      if(data.error_code == 'success'){
        toastAlert.load_complete();
        $scope.tag = data['info']['main_content'];
      }
    });
  }])
  .controller('TourTagIndexCtrl', ['$scope', '$http', '$rootScope', '$routeParams' , 'toastAlert', 'Tag', function($scope, $http, $rootScope, $routeParams , toastAlert, Tag) {
    $rootScope.top_title = '活动-'+$rootScope.tag[$routeParams.tag_id];
    $scope.tag_index = new Tag();
    $scope.city = $rootScope.city;
    $scope.tags = $rootScope.tag;
    $scope.period = {'all':'任何时间','today':'今天','tomorrow':'明天','this_weekend':'本周末'};
    // $http.get(apiBaseUrl+'tour/index?city_id=1&tag_id='+$routeParams.tour_id, {cache: true}).success(function(data) {
    //   if(data.error_code == 'success'){
    //     toastAlert.load_complete();
    //     $scope.tours = data['info']['main_content'];
    //   }
    // });
  }])
  .controller('TourShowCtrl', ['$scope', '$sce', '$http', '$routeParams', '$rootScope', 'toastAlert', function($scope, $sce, $http, $routeParams, $rootScope, toastAlert) {
    $rootScope.top_title = '活动';
    $scope.new_order = function () {
      // 判断用户是否登录如果没有登录则提示用户去登录
      if (!$rootScope.is_login) {
        if (confirm("登录后才可以和小伙伴一起愉快的玩耍哦~")) {
          window.location.href = '#/user/login';
          $rootScope.jump_url = '#/tour/show/'+$routeParams.tour_id;
        }
      } else {
        window.location.href = '#/order/new/'+$scope.tour.tour_id;
      }
    }
  	$http.get(apiBaseUrl+'tour/show?tour_id='+$routeParams.tour_id, {cache: true}).success(function(data) {
      $scope.tour = data['info']['main_content']['tour_detail'];
      $rootScope.weixin_config = {
        // 如果是正常的网页分享，则不要添加。否则会出现未审核应用
        appid: 'wx6bd626b3e369f97f', // 公共账号ID？
        img_url: $scope.tour.tour_weixin_pic || $scope.tour.tour_cover_url,
        img_width: '50',
        img_height: '50',
        link: 'http://m.nailaohui.com/#/tour/show/'+$routeParams.tour_id,
        desc: $scope.tour.tour_weixin_intro,
        title: $scope.tour.tour_name
      };
      $scope.tour_app_schedule = function() {
        return $sce.trustAsHtml($scope.tour.tour_app_schedule);
      };
      $scope.tour_app_expense = function() {
        return $sce.trustAsHtml($scope.tour.tour_app_expense);
      };

      $scope.album = data['info']['main_content']['tour_album'];
  		$scope.comments = data['info']['main_content']['comments'];
      toastAlert.load_complete();
  	});
  }])
  // 我的订单首页
  .controller('OrderIndexCtrl', ['$scope', '$http', '$rootScope', '$routeParams', 'toastAlert', 'Post', function($scope, $http, $rootScope, $routeParams, toastAlert, Post) {
    $rootScope.top_title = $rootScope.user.nickname;
    $scope.show_profile = true;
    $scope.posts = new Post();
    $http.get(apiBaseUrl+'user/show?user_id='+$rootScope.user.user_id, {cache: true}).success(function(data) {
      if(data.error_code == 'success'){
        $scope.user_info = data['info']['main_content'];
        angular.element('#user_avatar').attr({'ng-src':$scope.user_info.user_small_picture , 'src':$scope.user_info.user_small_picture});
      }
      toastAlert.load_complete();
    });
    $http.get(apiBaseUrl+'user/getbalance?session_token='+$rootScope.session_token, {cache: true}).success(function(data) {
      if(data.error_code == 'success'){
        $scope.user_balance = data['info']['main_content'];
      }
    });
  }])
  // 我的订单列表
  .controller('OrderShowCtrl', ['$scope', '$http', '$rootScope', 'toastAlert', 'Order', function($scope, $http, $rootScope, toastAlert, Order) {
    $rootScope.top_title = '我的订单';
    $rootScope.opts = {new_post: true, not_follow_wechat: true};
    $scope.orders = new Order();
  }])
  //参团信息
  .controller('OrderInfoCtrl', ['$scope', '$http', '$rootScope', '$routeParams', 'toastAlert', 'Post', function($scope, $http, $rootScope, $routeParams, toastAlert, Post) {
    $rootScope.top_title = $rootScope.user.nickname;
    $scope.show_profile = true;
    $scope.posts = new Post();
    $scope.user = {};
    // 提交表单
    $scope.submit = function () {
      if ($scope.loading) {return;};
      $scope.loading = true;
      toastAlert.loading();
      $http.post(apiBaseUrl+'user/joininfo', $scope.user).success(function(data) {
        $scope.loading = false;
        if (data.result) {
          toastAlert.alert('操作成功！', function() {
            if ($rootScope.jump_url) {
              window.location.href = $rootScope.jump_url;
              $rootScope.jump_url= '';
            } else {
              window.location.href = '#order/index';
            }
          });
        } else {
          toastAlert.alert(data.message);
        }
        toastAlert.load_complete();
      });
    };
    $http.get(apiBaseUrl+'user/getjoininfo', {cache: false}).success(function(data) {
      if(data.error_code == 'success'){
        $scope.user = data['info']['main_content'];
      }
      toastAlert.load_complete();
    });
  }])
  // 确认订单
  .controller('OrderConfirmCtrl', ['$scope', '$http', '$rootScope', '$routeParams' , 'toastAlert', 'Post', function($scope, $http, $rootScope, $routeParams , toastAlert, Post) {
    $rootScope.top_title = '确认订单';
    $scope.posts = new Post();
    $http.get(apiBaseUrl+'order/confirm?order_id='+$routeParams.order_id+'&session_token='+$rootScope.session_token, {cache: true}).success(function(data) {
      if(data.error_code == 'success'){
        $scope.order_info = data['info']['main_content'];
      }
      toastAlert.load_complete();
      $scope.charge_link = function(){
         window.location.href = apiBaseUrl+'order/wappay?order_id='+$routeParams.order_id;
      }
    });
  }]);


