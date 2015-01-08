'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('nailaohuiApp.services', []).
	// 随着浏览器的滚动，去加载图片
  factory('unveil', ['$window', '$http', function($window, $http) {
  	return {
  		// 当滚动到底部的时候去，加载数据
  		'load': function() {
  			/*
  			$(window).scroll(function() {
					// var height = $(document).height() - $(window).height();
					
					if($(window).scrollTop() >=  - pixelBuffer) {
						//console.log(loadHeight);
						console.log('loading');
					}
				});
				*/
  		}
  	}
  }]).
	// session 用户的登录信息
  factory('session', ['$window', '$http', '$rootScope', '$cookies', function($window, $http, $rootScope, $cookies) {
  	return {
  		// 当页面加载之后读取cookie信息
  		'init': function () {
  			if ($cookies.user_nickname) {
		      $rootScope.is_login = true;
		      $rootScope.session_token = $cookies.session_token;
		      $rootScope.user = {'nickname' :$cookies.user_nickname, 'user_id' :$cookies.user_id, 'is_profile_complete':$cookies.is_profile_complete};
		      $rootScope.city = {'1':'北京','2':'上海','3':'天津','4':'重庆','5':'黑龙江','6':'吉林','7':'辽宁','8':'山东','9':'山西','10':'陕西','11':'河北','12':'河南','13':'湖北','14':'湖南','15':'海南','16':'江苏','17':'江西','18':'广东','19':'广西','20':'云南','21':'贵州','22':'四川','23':'内蒙古','24':'宁夏','25':'甘肃','26':'青海','27':'西藏','28':'新疆','29':'安徽','30':'浙江','31':'福建','32':'港澳台'};
		      $rootScope.tag = {'1':'徒步','2':'登山','3':'骑马','4':'摄影','5':'滑雪','6':'骑行','7':'攀岩','8':'垂钓','9':'露营','10':'单身','11':'亲子','12':'情侣','13':'戏剧','14':'音乐','15':'电影','16':'讲座','17':'展览','18':'桌游','19':'跑步','20':'篮球','21':'游泳','22':'乒乓球','23':'台球','24':'公益','25':'海边','26':'草原'};
		    }
  		},
  		'login': function(user) {
  			// 将session token 保存到cookie
        var d = new Date();
        d.setTime(d.getTime() + (30*24*60*60*1000));
        document.cookie = 'session_token='+user.session_token+';expires='+d.toUTCString()+';path=/';
        document.cookie = 'user_nickname='+user.user_nickname+';expires='+d.toUTCString()+';path=/';
        document.cookie = 'user_id='+user.user_id+';expires='+d.toUTCString()+';path=/';
        $rootScope.user = {'nickname' :user.user_nickname, 'user_id' :user.user_id, 'is_profile_complete':user.is_profile_complete};
        $rootScope.session_token = user.session_token;
        $rootScope.is_login = true;
  		},
  		'logout': function () {
	      var d = new Date();
	      d.setTime(d.getTime() - 1);
	      document.cookie = 'session_token=;expires='+d.toUTCString()+';path=/';
	      document.cookie = 'user_nickname=;expires='+d.toUTCString()+';path=/';
	      document.cookie = 'user_id=;expires='+d.toUTCString()+';path=/';
	      $rootScope.is_login = false;
  		}
  	}
  }]).
	// 随着浏览器的滚动，去加载图片
  factory('Tag', ['$window', '$http', '$routeParams' , 'toastAlert', function($window, $http, $routeParams , toastAlert) {
  	var Tag = function() {
  		this.items = [];
  		this.loading = false;
  		this.page = 1;
  		this.images_count = 0;
  		this.complete = false;
  		this.city_id = $routeParams.city_id;
  		this.tag_id = $routeParams.tag_id;
  		this.period = $routeParams.period;
  	};
  	Tag.prototype.load = function () {
  		if (this.loading || this.complete) return;
	    this.loading = true;
	    toastAlert.loading();
      $http.get(apiBaseUrl+'tour/index?page='+this.page+'&city_id='+$routeParams.city_id+'&tag_id='+$routeParams.tag_id+'&period='+$routeParams.period, {cache: true}).success(function(data) {
	  		var items = data['info']['main_content'];
	  		if (items.length < 10) {
	  			this.complete = true;
	  		};
	      for (var i = 0; i < items.length; i++) {
	        this.items.push(items[i]);
	      }
	      this.loading = false;
	      toastAlert.load_complete();
	      this.page++;
	  	}.bind(this));
    };
  	return Tag;
  }]).
  factory('Tour', ['$window', '$http', 'toastAlert', function($window, $http, toastAlert) {
  	var Tour = function() {
  		this.items = [];
  		this.loading = false;
  		this.page = 1;
  		this.images_count = 0;
  		this.complete = false;
  	};
  	Tour.prototype.nextPage = function () {
  		if (this.loading || this.complete) return;
	    this.loading = true;

	    toastAlert.loading();
      $http.get(apiBaseUrl+'tour/index?page='+this.page, {cache: true}).success(function(data) {
	  		var items = data['info']['main_content'];
	  		if (items.length < 10) {
	  			this.complete = true;
	  		};
	      for (var i = 0; i < items.length; i++) {
	        this.items.push(items[i]);
	      }
	      this.loading = false;
	      toastAlert.load_complete();
	      this.page++;
	  	}.bind(this));
    };
  	return Tour;
  }]).
	factory('Order', ['$window', '$http', 'toastAlert', '$rootScope', function($window, $http, toastAlert, $rootScope) {
	  	var Order = function() {
	  		this.items = [];
	  		this.loading = false;
	  		this.page = 1;
	  		this.complete = false;
	  		// 加载这个人的动态
	  		this.user_id = '';
	  		this.user_post = false;
	  	};
	  	
	  	Order.prototype.load = function () {
	  		this.orderPost();
	  	};
	  	// 获取所有人的动态
	    Order.prototype.orderPost = function(){
	  		if (this.loading || this.complete) return;
		    this.loading = true;

		    toastAlert.loading();
		    // 如果要是等了的话就不缓存了，如果没有登录，则将列表数据缓存起来
	      $http.get(apiBaseUrl+'order/index?session_token='+$rootScope.session_token+'&page='+this.page, {cache: true}).success(function(data) {
		  		var items = data['info']['main_content'];
		  		if (items.length < 10) {
		  			this.complete = true;
		  		};
		      for (var i = 0; i < items.length; i++) {
		        this.items.push(items[i]);
		      }

		      this.loading = false;
		      toastAlert.load_complete();
		      this.page++;
		  	}.bind(this));    	
	  	};
	  	return Order;
  }]).  
	// post service 奶酪广场
  factory('Post', ['$window', '$http', 'toastAlert', '$rootScope', function($window, $http, toastAlert, $rootScope) {
  	var Post = function() {
  		this.items = [];
  		this.loading = false;
  		this.page = 1;
  		this.complete = false;
  		// 加载这个人的动态
  		this.user_id = '';
  		this.user_post = false;
  	};
  	
  	Post.prototype.load = function () {
  		// 如果设置这个变量为false 则表示是加载个人的动态
  		if (this.user_post) {
  			this.userPosts();
  		}else{
  			this.nextPage();
  		}
  	};
  	// 获取所有人的动态
  	Post.prototype.nextPage = function () {
  		if (this.loading || this.complete) return;
	    this.loading = true;

	    toastAlert.loading();
	    // 如果要是等了的话就不缓存了，如果没有登录，则将列表数据缓存起来
      $http.get(apiBaseUrl+'post/index?page='+this.page, {cache: true}).success(function(data) {
	  		var items = data['info']['main_content'];
	  		if (items.length < 10) {
	  			this.complete = true;
	  		};
	      for (var i = 0; i < items.length; i++) {
	        this.items.push(items[i]);
	      }
	      this.loading = false;
	      toastAlert.load_complete();
	      this.page++;
	  	}.bind(this));
    };
  	// 获取某个人的动态
  	Post.prototype.userPosts = function () {
  		if (this.loading || this.complete) return;
	    this.loading = true;

	    toastAlert.loading();
	    // 如果要是等了的话就不缓存了，如果没有登录，则将列表数据缓存起来
      $http.get(apiBaseUrl+'user/post?page='+this.page+'&user_id='+this.user_id, {cache: true}).success(function(data) {
	  		var items = data['info']['main_content'];
	  		if (items.length < 10) {
	  			this.complete = true;
	  		};
	      for (var i = 0; i < items.length; i++) {
	        this.items.push(items[i]);
	      }
	      this.loading = false;
	      toastAlert.load_complete();
	      this.page++;
	  	}.bind(this));
    };
  	return Post;
  }]).
	// cheese service 奶酪时间
  factory('Cheese', ['$window', '$http', 'toastAlert', '$routeParams', function($window, $http, toastAlert, $routeParams) {
  	var Cheese = function() {
  		this.items = [];
  		this.loading = false;
  		this.page = 1;
  		this.complete = false;
  	};
  	Cheese.prototype.nextPage = function () {
  		if (this.loading || this.complete) return;
	    this.loading = true;

	    toastAlert.loading();
      $http.get(apiBaseUrl+'cheese/index?type='+$routeParams.cheese_type+'&page='+this.page, {cache: true}).success(function(data) {
	  		var items = data['info']['main_content'];
	  		if (items.length < 10) {
	  			this.complete = true;
	  		};
	      for (var i = 0; i < items.length; i++) {
	        this.items.push(items[i]);
	      }
	      this.loading = false;
	      toastAlert.load_complete();
	      this.page++;
	  	}.bind(this));
    };
  	return Cheese;
  }]).
	// 评论
  factory('Comment', ['$window', '$http', 'toastAlert', '$routeParams', function($window, $http, toastAlert, $routeParams) {
  	var Comment = function() {
  		// !!! 这个不是当前评论的id  而是回复别人的id
  		this.comment_id = '';
  		this.items = [];
  		this.loading = false;
  		this.page = 1;
  		this.complete = false;
  		this.comment_content = '';
  		this.comment_type = '';
  		// 被评论的内容的id 比如评论的是活动  这个字段就是活动的id
  		this.be_commented = '';
  	};
  	// 删除评论
  	// Comment.prototype.delete = function () {
  	// 	$http.post(apiBaseUrl+'comment/delete', {comment_id:this.comment_id}).success(function(data) {
   //      this.loading = false;
   //      // 操作成功
   //      if (data.result) {
   //      	// 从评论列表中删除此评论
   //      	for (var i = 0; i < this.items.length; i++) {
   //      		if (true) {
        			
   //      		};
   //      	};
   //        toastAlert.alert('操作成功！');
   //      } else {
   //        toastAlert.alert(data.message);
   //      }
   //      toastAlert.load_complete();
   //    }.bind(this));
  	// }
  	// 创建新的评论
  	Comment.prototype.new = function (comment) {
  		var new_comment = {};

      if (comment.loading) {return;};
      comment.loading = true;
      toastAlert.loading();

      new_comment.comment_content = comment.comment_content;
      new_comment.comment_type = comment.comment_type;
      if (comment.comment_type == 'post') {
      	new_comment.post_id = comment.be_commented;
      } else if (comment.comment_type == 'tour') {
      	new_comment.tour_id = comment.be_commented;
      } else if (comment.comment_type == 'cheese') {
      	new_comment.cheese_id = comment.be_commented;
      };

      $http.post(apiBaseUrl+'comment/new?return_type=json', new_comment).success(function(data) {
        comment.loading = false;
        // 操作成功
        if (data.result) {
        	comment.comment_content = '';
        	this.items.unshift(data.info.main_content);
          toastAlert.alert('操作成功！');
        } else {
          toastAlert.alert(data.message);
        }
        toastAlert.load_complete();
      }.bind(this));
  	}
  	Comment.prototype.nextPage = function () {
  		if (this.loading || this.complete) return;
	    this.loading = true;
	    toastAlert.loading();
			
			// 加载奶酪广场的评论
			if (this.comment_type == 'post') {
				var url = apiBaseUrl+'comment/index?post_id='+this.be_commented+'&page='+this.page;
			} else if (this.comment_type == 'cheese') {
				var url = apiBaseUrl+'comment/index?cheese_id='+this.be_commented+'&page='+this.page+'&type=cheese';
			};
			$http.get(url, {cache: true}).success(function(data) {
	  		var items = data['info']['main_content'];
	  		if (items.length < 10) {
	  			this.complete = true;
	  		};
	      for (var i = 0; i < items.length; i++) {
	        this.items.push(items[i]);
	      }
	      this.loading = false;
	      toastAlert.load_complete();
	      this.page++;
	  	}.bind(this));
    };
  	return Comment;
  }]).
  // 提示
  factory('toastAlert', ['$window', '$http', '$rootScope', function($window, $http, $rootScope) {
  	return {
  		'alert': function (msg, callback) {
  			if ($rootScope.is_toast_alerting) {return;};
  			$rootScope.is_toast_alerting = true;
  			angular.element('#page').after("<div id='alert_block'><h4 id='alert_text'>"+msg+"</h4></div>");
  			angular.element('#alert_block').css({
				  'position': 'fixed',
				  'top': '40%',
				  'left': '15%',
				  'width': '70%',
				  'height': '20%',
				  'min-height': '30px',
				  'min-width': '20px',
				  'background': 'black',
				  'border-radius': '8px',
			  });
				var alert_block_height = $('#alert_block').height();
				var alert_text_height = $('#alert_text').height();

			  angular.element('#alert_text').css({
				  'color': '#FFFFFF',
					'margin-top': (alert_block_height-alert_text_height)/2,
  				'text-align': 'center',
			  });
			  angular.element('#alert_block').fadeOut(3000, function() {
			  	angular.element('#alert_block').remove();
			  	if (typeof(callback) == 'function') {
			  		callback();
			  	};
  				$rootScope.is_toast_alerting = false;
			  });
  		},
  		'load_complete': function() {
  			angular.element('.loading_block').remove();
  			$rootScope.is_toast_loading = false;
  		},
  		'loading': function() {
  			if ($rootScope.is_toast_loading) {return;};
  			$rootScope.is_toast_loading = true;

  			angular.element('#page').after("<div class='loading_block'><img src='/images/wap/rat_chasing.gif'></div>");
  			angular.element('.loading_block').css({
			    'position': 'fixed',
			    'top': '43%',
			    'left': '38%',
			    'width': '24%',
			    'height': '14%',
			    'background': 'black',
			    'border-radius': '8px',
			    'z-index': '0',
			    'opacity': '0.9',
			    'text-align': 'center',
			  });
  		}
  	}
  }]).
  // factory('infiniteLoad', ['$window', '$http', function($window, $http) {
  // 	return {
  // 		// 当滚动到底部的时候去，加载数据
  // 		'load': function(loadHeight, pixelBuffer, url, type='data') {
  // 			console.log(loadHeight);
  // 			$(window).scroll(function() {
		// 			// var height = $(document).height() - $(window).height();

		// 			if($(window).scrollTop() >= loadHeight - pixelBuffer) {
		// 				//console.log(loadHeight);
		// 				console.log('loading');
		// 			}
		// 		});
  // 		}
  // 	}
  // }]).
	// 将图片用正方形显示
  factory('squareImg', ['$window', function($window) {
  	return {
  		// 将长方形的图片，格式化显示在一个正方形的div 中
  		'format': function(element, elem_css, img_container_width, img_container_height, con_css) {
  			element.wrap('<div clas="square_fix"></div>');
  			element.load(function() {
  				var square_fix_ele = element.parent();
	        var img_width = element[0].naturalWidth;
	        var img_height = element[0].naturalHeight;

	        // 图片 居中显示
	        if (img_width > img_height) {
	        	var display_height = img_container_height;
	        	var display_width = (display_height/img_height)*img_width;
	          // 宽大于高，横幅型的图片
	        	angular.extend(elem_css, {
	            'margin-left': (img_container_width-display_width)/2+'px',
	            'width': display_width,
	            'height': display_height,
	          });
	        } else {
	          // 高大于宽，长颈鹿型的图片
	        	var display_width = img_container_width;
	        	var display_height = (img_height/img_width)*display_width;

	          angular.extend(elem_css, {
	            'margin-top': (img_container_height-display_height)/2+'px',
	            'width': display_width,
	            'height': display_height,
	          });
	        }

	        angular.extend(con_css, {
	          'width': img_container_width + 'px',
	          'height': img_container_height + 'px',
	          'float': 'left',
	          'overflow': 'hidden'
	        });

	        angular.extend(elem_css, {'max-width': 'none','max-height': 'none'});
	        
	        square_fix_ele.css(con_css);
	        element.css(elem_css);
  			});
  		}
  	}
  }]);





