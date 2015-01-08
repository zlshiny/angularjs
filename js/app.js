'use strict';

var rand = (CURRENT_ENV=='PRODUCTION') ? '201409241041' : Math.random();
// Declare app level module which depends on filters, and services
angular.module('nailaohuiApp', [
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'ngCookies',
  'infinite-scroll',
  'angularFileUpload',
  'nailaohuiApp.filters',
  'nailaohuiApp.services',
  'nailaohuiApp.directives',
  'nailaohuiApp.controllers'
], function($httpProvider) {
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];

}).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {templateUrl: '/wap/site/sliders', controller: 'HomeCtrl'});

  // 活动相关
  $routeProvider.when('/tour/index', {templateUrl: '/angularjs/partials/tour/index.html'+'?v='+rand, controller: 'TourIndexCtrl'});
  $routeProvider.when('/tour/show/:tour_id', {templateUrl: '/angularjs/partials/tour/show.html'+'?v='+rand, controller: 'TourShowCtrl'});
  $routeProvider.when('/tour/tags/', {templateUrl: '/angularjs/partials/tour/tags.html'+'?v='+rand, controller: 'TourTagsCtrl'});
  $routeProvider.when('/tour/tag_index/:tag_id/:city_id/:period', {templateUrl: '/angularjs/partials/tour/tag_index.html'+'?v='+rand, controller: 'TourTagIndexCtrl'});

  // 奶酪时间相关
  $routeProvider.when('/cheese/index/:cheese_type', {templateUrl: '/angularjs/partials/cheese/index.html'+'?v='+rand, controller: 'CheeseIndexCtrl'});
  $routeProvider.when('/cheese/show/:cheese_id', {templateUrl: '/angularjs/partials/cheese/show.html'+'?v='+rand, controller: 'CheeseShowCtrl'});

  // 奶酪广场
  $routeProvider.when('/post/index', {templateUrl: '/angularjs/partials/post/index.html'+'?v='+rand, controller: 'PostIndexCtrl'});
  $routeProvider.when('/post/show/:post_id', {templateUrl: '/angularjs/partials/post/show.html'+'?v='+rand, controller: 'PostShowCtrl'});
  $routeProvider.when('/post/new', {templateUrl: '/angularjs/partials/post/new.html'+'?v='+rand, controller: 'PostNewCtrl'});

  // 个人中心
  $routeProvider.when('/user/login', {templateUrl: '/angularjs/partials/user/login.html'+'?v='+rand, controller: 'UserLoginCtrl'});
  $routeProvider.when('/user/register', {templateUrl: '/angularjs/partials/user/register.html'+'?v='+rand, controller: 'UserRegisterCtrl'});
  $routeProvider.when('/user/forget', {templateUrl: '/angularjs/partials/user/forget.html'+'?v='+rand, controller: 'UserForgetCtrl'});
  $routeProvider.when('/user/show/:user_id', {templateUrl: '/angularjs/partials/user/show.html'+'?v='+rand, controller: 'UserShowCtrl'});
  $routeProvider.when('/user/update', {templateUrl: '/angularjs/partials/user/update.html'+'?v='+rand, controller: 'UserUpdateCtrl'});
  
  //我的订单首页
  $routeProvider.when('/order/index', {templateUrl: '/angularjs/partials/order/index.html'+'?v='+rand, controller: 'OrderIndexCtrl'});
  //我的订单
  $routeProvider.when('/order/show', {templateUrl: '/angularjs/partials/order/show.html'+'?v='+rand, controller: 'OrderShowCtrl'});
  //参团信息
  $routeProvider.when('/order/info', {templateUrl: '/angularjs/partials/order/info.html'+'?v='+rand, controller: 'OrderInfoCtrl'});
  //确认订单
  $routeProvider.when('/order/confirm/:order_id', {templateUrl: '/angularjs/partials/order/confirm.html'+'?v='+rand, controller: 'OrderConfirmCtrl'});
  // 新订单
  $routeProvider.when('/order/new/:tour_id', {templateUrl: '/angularjs/partials/order/new.html'+'?v='+rand, controller: 'OrderNewCtrl'});
  $routeProvider.when('/order/success', {templateUrl: '/angularjs/partials/order/success.html'+'?v='+rand, controller: 'OrderSuccessCtrl'});
  $routeProvider.when('/order/fail', {templateUrl: '/angularjs/partials/order/fail.html'+'?v='+rand, controller: 'OrderFailCtrl'});
  // 下载app
  $routeProvider.when('/download', {templateUrl: '/angularjs/partials/download.html'+'?v='+rand, controller: 'AppDownloadCtrl'});
  $routeProvider.when('/exam/index', {templateUrl: '/angularjs/partials/exam/index.html'+'?v='+rand, controller: 'ExamIndexCtrl'});
  $routeProvider.when('/exam/step/:step', {templateUrl: '/angularjs/partials/exam/step.html'+'?v='+rand, controller: 'ExamStepCtrl'});
  
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
