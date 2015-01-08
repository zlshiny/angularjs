'use strict';

/* Filters */

angular.module('nailaohuiApp.filters', []).
	// 将时间戳，转换为标准的 时间格式 07月02日 12:09
  filter('normalDate', ['$filter', function($filter) {
	  return function(input) {
	  	var dateFilter = $filter('date');
	  	return dateFilter(input*1000, 'MM月dd日 H:mm');
	  };
	}]).
	// 将时间戳，转换为友好的时间，多久之前
  filter('friendlyDate', ['$filter', function($filter) {
	  return function(input) {
	  	var current_stamp = parseInt(new Date().valueOf()/1000);
	  	var time_dis = current_stamp - input;
	  	if (time_dis < 3*60) {
	  		// 小于 3 分钟
	  		return '刚刚';
	  	} else if (time_dis < 60*60) {
	  		// 小于1小时
	  		return parseInt(time_dis/60)+'分钟前';
	  	} else if (time_dis < 24*60*60) {
	  		// 小于1天
	  		return parseInt(time_dis/60/60)+'小时前';
	  	} else if (time_dis < 7*24*60*60) {
	  		// 小于1周
	  		return parseInt(time_dis/24/60/60)+'天前';
	  	}
	  	return $filter('date')(input*1000, 'MM月dd日 H:mm');
	  };
	}]).
	// 性别的filter
  filter('id_type', ['$filter', function($filter) {
	  return function(input) {
	  	if (input == 'id_card') {
	  		return '身份证';
	  	} else if (input == 'passport') {
	  		return '护照';
	  	} else if (input == 'officer_card') {
	  		return '军官证';
	  	} else if (input == 'sibling') {	
	  		return '港澳回乡证或台胞证';
	  	} else {
	  		return '';
	  	}
	  };
	}]).
	// 证件类型的filter
  filter('gender', ['$filter', function($filter) {
	  return function(input) {
	  	if (input == 0) {
	  		return '女';
	  	} else if (input == 1) {
	  		return '男';
	  	} else {
	  		return '';
	  	}
	  };
	}]).
	// 将奶酪广场的帖子内容中的表情，从bbcode 替换为图片
  filter('face', ['$filter', '$sce', function($filter, $sce) {
	  return function(input) {
	  	input = input.replace(/\[兔子\]/g, "<img class='faceimg' src='/img1/face/001.gif' />").replace(/\[熊猫\]/g, "<img class='faceimg' src='/img1/face/002.gif' />").replace(/\[给力\]/g, "<img class='faceimg' src='/img1/face/003.gif' />").replace(/\[神马\]/g, "<img class='faceimg' src='/img1/face/004.gif' />").replace(/\[浮云\]/g, "<img class='faceimg' src='/img1/face/005.gif' />").replace(/\[织\]/g, "<img class='faceimg' src='/img1/face/006.gif' />").replace(/\[围观\]/g, "<img class='faceimg' src='/img1/face/007.gif' />").replace(/\[威武\]/g, "<img class='faceimg' src='/img1/face/008.gif' />").replace(/\[嘻嘻\]/g, "<img class='faceimg' src='/img1/face/009.gif' />").replace(/\[哈哈\]/g, "<img class='faceimg' src='/img1/face/010.gif' />").replace(/\[爱你\]/g, "<img class='faceimg' src='/img1/face/105.gif' />").replace(/\[晕\]/g, "<img class='faceimg' src='/img1/face/012.gif' />").replace(/\[泪\]/g, "<img class='faceimg' src='/img1/face/013.gif' />").replace(/\[馋嘴\]/g, "<img class='faceimg' src='/img1/face/014.gif' />").replace(/\[抓狂\]/g, "<img class='faceimg' src='/img1/face/015.gif' />").replace(/\[哼\]/g, "<img class='faceimg' src='/img1/face/016.gif' />").replace(/\[可爱\]/g, "<img class='faceimg' src='/img1/face/017.gif' />").replace(/\[怒\]/g, "<img class='faceimg' src='/img1/face/018.gif' />").replace(/\[汗\]/g, "<img class='faceimg' src='/img1/face/019.gif' />").replace(/\[呵呵\]/g, "<img class='faceimg' src='/img1/face/020.gif' />").replace(/\[睡觉\]/g, "<img class='faceimg' src='/img1/face/021.gif' />").replace(/\[钱\]/g, "<img class='faceimg' src='/img1/face/022.gif' />").replace(/\[偷笑\]/g, "<img class='faceimg' src='/img1/face/023.gif' />").replace(/\[酷\]/g, "<img class='faceimg' src='/img1/face/024.gif' />").replace(/\[衰\]/g, "<img class='faceimg' src='/img1/face/025.gif' />").replace(/\[吃惊\]/g, "<img class='faceimg' src='/img1/face/026.gif' />").replace(/\[闭嘴\]/g, "<img class='faceimg' src='/img1/face/027.gif' />").replace(/\[鄙视\]/g, "<img class='faceimg' src='/img1/face/028.gif' />").replace(/\[挖鼻屎\]/g, "<img class='faceimg' src='/img1/face/029.gif' />").replace(/\[花心\]/g, "<img class='faceimg' src='/img1/face/030.gif' />").replace(/\[鼓掌\]/g, "<img class='faceimg' src='/img1/face/031.gif' />").replace(/\[失望\]/g, "<img class='faceimg' src='/img1/face/032.gif' />").replace(/\[帅\]/g, "<img class='faceimg' src='/img1/face/033.gif' />").replace(/\[照相机\]/g, "<img class='faceimg' src='/img1/face/034.gif' />").replace(/\[落叶\]/g, "<img class='faceimg' src='/img1/face/035.gif' />").replace(/\[汽车\]/g, "<img class='faceimg' src='/img1/face/036.gif' />").replace(/\[飞机\]/g, "<img class='faceimg' src='/img1/face/037.gif' />").replace(/\[爱心传递\]/g, "<img class='faceimg' src='/img1/face/038.gif' />").replace(/\[奥特曼\]/g, "<img class='faceimg' src='/img1/face/039.gif' />").replace(/\[实习\]/g, "<img class='faceimg' src='/img1/face/040.gif' />").replace(/\[思考\]/g, "<img class='faceimg' src='/img1/face/041.gif' />").replace(/\[生病\]/g, "<img class='faceimg' src='/img1/face/042.gif' />").replace(/\[亲亲\]/g, "<img class='faceimg' src='/img1/face/043.gif' />").replace(/\[怒骂\]/g, "<img class='faceimg' src='/img1/face/044.gif' />").replace(/\[太开心\]/g, "<img class='faceimg' src='/img1/face/045.gif' />").replace(/\[懒得理你\]/g, "<img class='faceimg' src='/img1/face/046.gif' />").replace(/\[右哼哼\]/g, "<img class='faceimg' src='/img1/face/047.gif' />").replace(/\[左哼哼\]/g, "<img class='faceimg' src='/img1/face/048.gif' />").replace(/\[嘘\]/g, "<img class='faceimg' src='/img1/face/049.gif' />").replace(/\[委屈\]/g, "<img class='faceimg' src='/img1/face/050.gif' />").replace(/\[吐\]/g, "<img class='faceimg' src='/img1/face/051.gif' />").replace(/\[可怜\]/g, "<img class='faceimg' src='/img1/face/052.gif' />").replace(/\[打哈气\]/g, "<img class='faceimg' src='/img1/face/053.gif' />").replace(/\[顶\]/g, "<img class='faceimg' src='/img1/face/054.gif' />").replace(/\[疑问\]/g, "<img class='faceimg' src='/img1/face/055.gif' />").replace(/\[做鬼脸\]/g, "<img class='faceimg' src='/img1/face/056.gif' />").replace(/\[害羞\]/g, "<img class='faceimg' src='/img1/face/057.gif' />").replace(/\[书呆子\]/g, "<img class='faceimg' src='/img1/face/058.gif' />").replace(/\[困\]/g, "<img class='faceimg' src='/img1/face/059.gif' />").replace(/\[悲伤\]/g, "<img class='faceimg' src='/img1/face/060.gif' />").replace(/\[感冒\]/g, "<img class='faceimg' src='/img1/face/061.gif' />").replace(/\[拜拜\]/g, "<img class='faceimg' src='/img1/face/062.gif' />").replace(/\[黑线\]/g, "<img class='faceimg' src='/img1/face/063.gif' />").replace(/\[不要\]/g, "<img class='faceimg' src='/img1/face/064.gif' />").replace(/\[good\]/g, "<img class='faceimg' src='/img1/face/065.gif' />").replace(/\[弱\]/g, "<img class='faceimg' src='/img1/face/066.gif' />").replace(/\[ok\]/g, "<img class='faceimg' src='/img1/face/067.gif' />").replace(/\[赞\]/g, "<img class='faceimg' src='/img1/face/068.gif' />").replace(/\[来\]/g, "<img class='faceimg' src='/img1/face/069.gif' />").replace(/\[耶\]/g, "<img class='faceimg' src='/img1/face/070.gif' />").replace(/\[haha\]/g, "<img class='faceimg' src='/img1/face/071.gif' />").replace(/\[拳头\]/g, "<img class='faceimg' src='/img1/face/072.gif' />").replace(/\[最差\]/g, "<img class='faceimg' src='/img1/face/073.gif' />").replace(/\[握手\]/g, "<img class='faceimg' src='/img1/face/074.gif' />").replace(/\[心\]/g, "<img class='faceimg' src='/img1/face/075.gif' />").replace(/\[伤心\]/g, "<img class='faceimg' src='/img1/face/076.gif' />").replace(/\[猪头\]/g, "<img class='faceimg' src='/img1/face/077.gif' />").replace(/\[咖啡\]/g, "<img class='faceimg' src='/img1/face/078.gif' />").replace(/\[话筒\]/g, "<img class='faceimg' src='/img1/face/079.gif' />").replace(/\[月亮\]/g, "<img class='faceimg' src='/img1/face/080.gif' />").replace(/\[太阳\]/g, "<img class='faceimg' src='/img1/face/081.gif' />").replace(/\[干杯\]/g, "<img class='faceimg' src='/img1/face/082.gif' />").replace(/\[萌\]/g, "<img class='faceimg' src='/img1/face/083.gif' />").replace(/\[礼物\]/g, "<img class='faceimg' src='/img1/face/084.gif' />").replace(/\[互粉\]/g, "<img class='faceimg' src='/img1/face/085.gif' />").replace(/\[蜡烛\]/g, "<img class='faceimg' src='/img1/face/086.gif' />").replace(/\[绿丝带\]/g, "<img class='faceimg' src='/img1/face/087.gif' />").replace(/\[沙尘暴\]/g, "<img class='faceimg' src='/img1/face/088.gif' />").replace(/\[钟\]/g, "<img class='faceimg' src='/img1/face/089.gif' />").replace(/\[自行车\]/g, "<img class='faceimg' src='/img1/face/090.gif' />").replace(/\[蛋糕\]/g, "<img class='faceimg' src='/img1/face/091.gif' />").replace(/\[围脖\]/g, "<img class='faceimg' src='/img1/face/092.gif' />").replace(/\[手套\]/g, "<img class='faceimg' src='/img1/face/093.gif' />").replace(/\[雪\]/g, "<img class='faceimg' src='/img1/face/094.gif' />").replace(/\[雪人\]/g, "<img class='faceimg' src='/img1/face/095.gif' />").replace(/\[温暖帽子\]/g, "<img class='faceimg' src='/img1/face/096.gif' />").replace(/\[微风\]/g, "<img class='faceimg' src='/img1/face/097.gif' />").replace(/\[足球\]/g, "<img class='faceimg' src='/img1/face/098.gif' />").replace(/\[电影\]/g, "<img class='faceimg' src='/img1/face/099.gif' />").replace(/\[风扇\]/g, "<img class='faceimg' src='/img1/face/100.gif' />").replace(/\[鲜花\]/g, "<img class='faceimg' src='/img1/face/101.gif' />").replace(/\[喜\]/g, "<img class='faceimg' src='/img1/face/102.gif' />").replace(/\[手机\]/g, "<img class='faceimg' src='/img1/face/103.gif' />").replace(/\[音乐\]/g, "<img class='faceimg' src='/img1/face/104.gif' />").replace(/\[我爱你\]/g, "<img class='faceimg' src='/img1/face/011.gif' />");
      return $sce.trustAsHtml(input);
	  };
	}]);
