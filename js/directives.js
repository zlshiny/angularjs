'use strict';

/* Directives */


angular.module('nailaohuiApp.directives', []).
  // 滚动到页面底部时自动加载，列表数据
  // directive('scrollBottomLoad', ['$swipe', '$routeParams', function($swipe, $routeParams) {
  //   return {
  //     restrict: 'A',
  //     link: function (scope, element, attrs) {
  //       var handler = function() {
  //         var height = $(document).height() - $(window).height();
  //         var pixelBuffer = 200;
  //         if($(window).scrollTop() >= height - pixelBuffer) {
  //           scope.load_more();
  //         }
  //       }
  //       $(window).on('scroll', handler);
  //       scope.$on('$destroy', function() {
  //         return $window.off('scroll', handler);
  //       });
  //     }
  //   };
  // }]).
  // 评论的样式修正
  directive('commentWidthFix', ['$swipe', '$routeParams', function($swipe, $routeParams) {
    return {
      restrict: 'A',
      // template: '<img class="user_avatar" ng-src="/img1/nophoto.jpg" />',
      // replace: true,
      link: function (scope, element, attrs) {
        var window_width = angular.element(window).width();
        element.css('width', window_width-64);
      }
    };
  }]).
  // 用户的头像
  directive('userAvatar', ['$swipe', '$routeParams', 'squareImg', function($swipe, $routeParams, squareImg) {
    return {
      restrict: 'E',
      template: '<img class="user_avatar" ng-src="/img1/nophoto.jpg" />',
      replace: true,
      link: function (scope, element, attrs) {

        var width = attrs.avartarWidth ? attrs.avartarWidth : 50;
        var height = attrs.avartarHeight ? attrs.avartarHeight : 50;
        var border_radius = 5;
        if (attrs.avartarType == 'circle') {
          border_radius = width;
        };
        squareImg.format(element, {}, width, height, {'border-radius': border_radius+'px'});
      }
    };
  }]).
  // 奶酪广场帖子，图片的样式格式化
  directive('postImg', ['$swipe', '$routeParams', 'squareImg', function($swipe, $routeParams, squareImg) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var window_width = angular.element(window).width();

        var img_container_width = (window_width-86) / 3;
        var img_container_height = img_container_width;

        squareImg.format(element, {}, img_container_width, img_container_height, {'border-radius': '5px', 'margin-left': '3px','margin-bottom': '3px',});
      }
    };
  }]).
  // 图片lazyload
  directive('lazyImg', ['$swipe', '$routeParams', function($swipe, $routeParams) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        // todo 检测浏览器滚动事件
        var img = new Image;
        img.src = attrs.lazySrc;
        img.onload = function() {
          element[0].src = img.src;
        };
      }
    };
  }]).
  // 分页的行为
  directive('cheeseCategory', ['$swipe', '$routeParams', 'squareImg', function($swipe, $routeParams, squareImg) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        // 当前的分类
        if (attrs.cheesetype == $routeParams.cheese_type) {
          var current_type_img = new Image();
          current_type_img.src = element.attr('touch-src');
          current_type_img.onload = function() {
            var tmpsrc = element.attr('src');
            element.attr('src', element.attr('touch-src'));
            element.attr('touch-src', tmpsrc);
          } 
        }

        element.on('click', function() {
          $(window).off('scroll');
          window.location.href = attrs.href;
        });
      }
    };
  }]).
  // 链接行为
  directive('linkable', ['$swipe', function($swipe) {
  	return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        $swipe.bind(element, {
          'start': function(coords) {

          },
          'move': function(coords) {

          },
          'end': function(coords) {

          },
          'cancel': function(coords) {

          },
        });

      	element.on('click', function() {
          window.location.href = attrs.href;
      	});
      }
    };
  }]).
  directive('chargeClick', ['$swipe', function($swipe) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.on('click', function() {
          // alert(element.attr('data'))
          // 
          angular.element('.zf_check').html('').attr('data',0);
          element.html('<img src="/images/wap/xuanze@2x.png">').attr('data',1);
        });
      }
    };
  }]).
  directive('tourTouch', ['$swipe', function($swipe) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          // var touch_time = null , stop_add , stop_add = true;
          // element.on('touchstart', function() {
          //   stop_add = setInterval(function(){
          //       touch_time++
          //     },500);             
          // });
          // element.on('touchend', function() {
          //   if(touch_time >= 1){
          //     touch_time = 0;
          //     icon_animate();
          //     $('.icons span').show();
          //   }
          //   clearInterval(stop_add);
          // });
          // var icon_animate = function(){
          //   var rangeN=3,timeout=35; 
          //   var range=Math.floor(Math.random()*rangeN); 
          //   $('.icons').css({'left':range})
          //   var touch_time=setTimeout(function(){icon_animate()},timeout); 
          // }
        }
      };
    }]).
    directive('selectCheck', ['$swipe', function($swipe) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('change',function(){
              var type = element.attr('type');
              if(type == 1){
                angular.element('.city').val(element.val());
              }else if(type == 2){
                angular.element('.tag').val(element.val());
              }else if(type == 3){
                angular.element('.period').val(element.val());
              }
              window.location.href = '#/tour/tag_index/'+angular.element('.tag').val()+'/'+angular.element('.city').val()+'/'+angular.element('.period').val();
            })
        }
      };
    }]);
