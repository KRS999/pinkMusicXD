'use strict';

(function () {
	//MinimalComments HardCode
	//Гулящие полоски
	particlesJS.load('particles-js', 'libs/particles/particles.json', function () {});
	//Urls
	var musicUrl = 'https://mp3ton.info';
	var musicPopUrl = 'https://mp3ton.info/populyarnye/';
	var musicProxy = 'https://cors.io/?';
	var musicProxy2 = 'https://cors-anywhere.herokuapp.com/';
	var musicSearchUrl = 'https://mp3ton.info/?do=search&mode=advanced&subaction=search&story=';
	var musicArr = [];
	var musicObj = {};
	var musicHtml = '';
	var infoHtml = '';
	//DOM
	var player = $('.player');
	var musicItems = $('.music-items');
	var musicBtns = $('[data-btn]');
	var playerPlaylist = $('.player-playlist');
	var infoBox = $('.info');
	var infoSong = $('.album__bottom');
	var preloader = $('.preloader');
	var preloaderAjax = $('.preloader-ajax');
	var playerSearchBox = $('.player__search');
	var playerSeachInput = $('.player__search input');
	var amplitudeShuffle = $('#shuffle');
	var amplitudeRepeat = $('#repeat');
	//Settings App
	var onlineMusicSettings = JSON.parse(localStorage.getItem('music-settings')) || {
		'shuffle': false,
		'repeat': false,
		'volume': 100,
		'animateTimer': 600
	};
	var onlineMusicApp = {
		//Общий запрос
		onlineMusicRequest: function onlineMusicRequest(url, call, ajaxLoad) {
			//Если в аргкмент приходит true то вызываем ajax preloader
			if (ajaxLoad === true) {
				$(preloaderAjax).fadeIn();
			}
			$.ajax({
				url: musicProxy2 + url,
				method: 'GET',
				dataType: 'html',
				success: call,
				complete: function complete(data) {
					if (data.status === 200) {
						$(preloader).fadeOut(onlineMusicSettings.animateTimer);
						$(preloaderAjax).fadeOut(onlineMusicSettings.animateTimer);
					} else {
						console.log('Сервер не доступен!');
					}
				},
				error: function error(err) {
					console.error(err);
				}
			});
		},

		//Общий запрос на вывод музыки
		onlineMusicPlay: function onlineMusicPlay(url, ajaxPreloader) {
			this.onlineMusicRequest(url, function (data) {
				var musicList = $(data).find('.play-item');
				var musicListLength = $(musicList).length;
				//Обнкляем при повторном запросе
				musicHtml = '';
				musicArr = [];
				musicItems.empty();
				$.each(musicList, function (i, el) {
					musicObj = {};
					var musicMp3 = '' + musicUrl + $(el).attr('data-file');
					//console.log(el);
					var musicArtist = $(el).find('.ps-title').text();
					var musicName = $(el).find('.track-namew').text();
					var musicTime = '0' + $(el).find('.p-right').text();
					var musicCover = '' + musicUrl + $(el).find('.main-news-image img').attr('src');
					var musicLink = $(el).find('.play-desc').attr('href');
					//console.log(musicLink);
					//Создаем объекты
					musicObj.url = musicMp3;
					musicObj.artist = musicArtist;
					musicObj.name = musicName;
					musicObj.time = musicTime;
					musicObj.cover_art_url = musicCover;
					//Вносим объекты в массив
					musicArr.push(musicObj);
					//Элементы
					musicHtml += '\n\t\t\t\t\t<div class="song-wrap">\n\t\t\t\t\t\t<div class="song amplitude-song-container amplitude-play-pause" amplitude-song-index="' + i + '">\n\t\t\t\t\t\t\t<div class="song-cover">\n\t\t\t\t\t\t\t\t<img src="' + musicCover + '" alt="">\n\t\t\t\t\t\t\t\t<i class="large material-icons now-playing">play_arrow</i>\n\t\t\t\t\t\t\t\t<i class="large material-icons yes-playing">pause</i>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="song-meta-container">\n\t\t\t\t\t\t\t\t<span>' + musicArtist + '</span>\n\t\t\t\t\t\t\t\t<span class="song-name">' + musicName + '</span>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<a href="#" data-href="' + musicLink + '" class="song__option music__btn"><i class="material-icons">more_horiz</i></a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t';
				});
				if (musicListLength === 0) {
					musicHtml = '\n\t\t\t\t\t<p class="empty">\u041D\u0435\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E!</p>\n\t\t\t\t\t';
				}
				//Выносим контент
				musicItems.append(musicHtml);
				//Передаем массив для проигравания
				Amplitude.pause();
				Amplitude.init({
					"songs": musicArr,
					"volume": onlineMusicSettings.volume
				});
				//Настройки
				if (onlineMusicSettings.shuffle === true) {
					$(amplitudeShuffle).addClass('amplitude-shuffle-on');
					Amplitude.setShuffle();
				}
				if (onlineMusicSettings.repeat === true) {
					$(amplitudeRepeat).addClass('amplitude-repeat-on');
					Amplitude.setRepeat();
				}
				//Скоролинг вверх
				scrollTopDown(musicItems);
			}, ajaxPreloader);
		},
		onlineMusicInformation: function onlineMusicInformation(url) {
			infoHtml = '';
			$(infoSong).empty();
			this.onlineMusicRequest(url, function (data) {
				//console.log(data);
				var info = $(data).find('ul.finfo');
				var infoTitle = $(data).find('.fright h1 span').text();
				var infoFormat = $(info).children('li').eq(1).children('span')[0].nextSibling.data;
				var infoSize = $(info).children('li').eq(2).children('span')[0].nextSibling.data;
				var infoBitrate = $(info).children('li').eq(3).children('span')[0].nextSibling.data;
				var infoTime = $(info).children('li').eq(4).children('span')[0].nextSibling.data.trim();
				var infoDownloadLink = '' + musicUrl + $(data).find('.fplay').attr('data-file');
				infoHtml = '\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<h1>' + infoTitle + '</h1>\n\t\t\t\t\t\t<li>\u0424\u043E\u0440\u043C\u0430\u0442: <span>' + infoFormat + '</span></li>\n\t\t\t\t\t\t<li>\u0420\u0430\u0437\u043C\u0435\u0440: <span>' + infoSize + '</span></li>\n\t\t\t\t\t\t<li>\u0411\u0438\u0442\u0440\u0435\u0439\u0442: <span>' + infoBitrate + '</span></li>\n\t\t\t\t\t\t<li>\u0414\u043B\u0438\u0442\u0435\u0442\u043B\u044C\u043D\u043E\u0441\u0442\u044C: <span>0' + infoTime + '</span></li>\n\t\t\t\t\t\t<li><a href="' + infoDownloadLink + '">\u0421\u043A\u0430\u0447\u0430\u0442\u044C</a></li>\n\t\t\t\t\t</ul>\n\t\t\t\t';
				$(infoSong).append(infoHtml);
				$(infoBox).addClass('info-on');
			}, true);
		}
	};
	//Вызываем приложения
	onlineMusicApp.onlineMusicPlay(musicPopUrl);
	//События
	$(musicBtns).on('click', function (e) {
		e.preventDefault();
		switch ($(this).attr('data-btn')) {
			case 'menu':
				console.log(1);
				break;
			case 'playlist':
				$(playerPlaylist).toggleClass('player-playlist_on');
				$(player).toggleClass('player-off');
				break;
			case 'info-close':
				$(infoBox).removeClass('info-on');
				break;
			case 'player-search':
				$(playerSearchBox).addClass('player__search-on');
				$(playerSeachInput).focus();
				break;
			case 'close-search':
				$(playerSearchBox).removeClass('player__search-on');
				break;
			case 'music-search':
				onlineMusicApp.onlineMusicPlay('' + musicSearchUrl + playerSeachInput.val(), true);
				break;
			case 'shuffle':
				if ($(this).hasClass('amplitude-shuffle-on') === true) {
					onlineMusicSettings.shuffle = false;
					reloadSettings();
				} else {
					onlineMusicSettings.shuffle = true;
					reloadSettings();
				}
				break;
			case 'repeat':
				if ($(this).hasClass('amplitude-repeat-on') === true) {
					onlineMusicSettings.repeat = false;
					reloadSettings();
				} else {
					onlineMusicSettings.repeat = true;
					reloadSettings();
				}
				break;
			case 'library':
				onlineMusicApp.onlineMusicPlay(musicPopUrl, true);
				break;
			default:
				return false;
				break;
		}
	});
	//Вызов окна информации
	$(musicItems).on('click', 'a.song__option', function (e) {
		e.preventDefault();
		var dataHref = $(this).attr('data-href');
		onlineMusicApp.onlineMusicInformation(dataHref);
	});
	//Функции
	//Запуск настрояк
	function reloadSettings() {
		localStorage.setItem('music-settings', JSON.stringify(onlineMusicSettings));
	}
	reloadSettings();
	//ScrollTopDown
	function scrollTopDown(el) {
		$(el).animate({
			'scrollTop': 0
		}, onlineMusicSettings.animateTimer);
	}
})();