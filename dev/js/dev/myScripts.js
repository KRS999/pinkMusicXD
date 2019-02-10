(() => {
	//MinimalComments HardCode
	//Гулящие полоски
	particlesJS.load('particles-js', 'libs/particles/particles.json', () => {});
	//Urls
	let musicUrl = 'https://mp3ton.info';
	let musicPopUrl = 'https://mp3ton.info/populyarnye/';
	let musicProxy = 'https://cors.io/?';
	let musicProxy2 = 'https://cors-anywhere.herokuapp.com/';
	let musicSearchUrl = 'https://mp3ton.info/?do=search&mode=advanced&subaction=search&story=';
	let musicArr = [];
	let musicObj = {};
	let musicHtml = '';
	let infoHtml = '';
	//DOM
	let player = $('.player');
	let musicItems = $('.music-items');
	let musicBtns = $('[data-btn]');
	let playerPlaylist = $('.player-playlist');
	let infoBox = $('.info');
	let infoSong = $('.album__bottom');
	let preloader = $('.preloader');
	let preloaderAjax = $('.preloader-ajax');
	let playerSearchBox = $('.player__search');
	let playerSeachInput = $('.player__search input');
	let amplitudeShuffle = $('#shuffle');
	let amplitudeRepeat = $('#repeat');
	//Settings App
	let onlineMusicSettings = JSON.parse(localStorage.getItem('music-settings')) || {
		'shuffle': false,
		'repeat': false,
		'volume': 100,
		'animateTimer': 600,
	};
	const onlineMusicApp = {
		//Общий запрос
		onlineMusicRequest(url, call, ajaxLoad) {
			//Если в аргкмент приходит true то вызываем ajax preloader
			if(ajaxLoad === true) {
				$(preloaderAjax).fadeIn();
			}
			$.ajax({
				url: musicProxy2 + url,
				method: 'GET',
				dataType: 'html',
				success: call,
				complete: (data) => {
					if(data.status === 200) {
						$(preloader).fadeOut(onlineMusicSettings.animateTimer);
						$(preloaderAjax).fadeOut(onlineMusicSettings.animateTimer);
					}else{
						console.log('Сервер не доступен!');
					}
				},
				error: (err) => {
					console.error(err);
				}
			});
		},
		//Общий запрос на вывод музыки
		onlineMusicPlay(url, ajaxPreloader) {
			this.onlineMusicRequest(url, (data) => {
				let musicList = $(data).find('.play-item');
				let musicListLength = $(musicList).length;
				//Обнкляем при повторном запросе
				musicHtml = '';
				musicArr = [];
				musicItems.empty();
				$.each(musicList, (i, el) => {
					musicObj = {};
					let musicMp3 = `${musicUrl}${$(el).attr('data-file')}`;
					//console.log(el);
					let musicArtist = $(el).find('.ps-title').text();
					let musicName = $(el).find('.track-namew').text();
					let musicTime = `0${$(el).find('.p-right').text()}`;
					let musicCover = `${musicUrl}${$(el).find('.main-news-image img').attr('src')}`;
					let musicLink = $(el).find('.play-desc').attr('href');
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
					musicHtml += 
					`
					<div class="song-wrap">
						<div class="song amplitude-song-container amplitude-play-pause" amplitude-song-index="${i}">
							<div class="song-cover">
								<img src="${musicCover}" alt="">
								<i class="large material-icons now-playing">play_arrow</i>
								<i class="large material-icons yes-playing">pause</i>
							</div>
							<div class="song-meta-container">
								<span>${musicArtist}</span>
								<span class="song-name">${musicName}</span>
							</div>
						</div>
						<a href="#" data-href="${musicLink}" class="song__option music__btn"><i class="material-icons">more_horiz</i></a>
						</div>
					</div>
					`;
				});
				if(musicListLength === 0) {
					musicHtml = 
					`
					<p class="empty">Нечего не найдено!</p>
					`
				}
				//Выносим контент
				musicItems.append(musicHtml);
				//Передаем массив для проигравания
				Amplitude.pause();
				Amplitude.init({
					"songs": musicArr,
					"volume" : onlineMusicSettings.volume,
				});
				//Настройки
				if(onlineMusicSettings.shuffle === true) {
					$(amplitudeShuffle).addClass('amplitude-shuffle-on');
					Amplitude.setShuffle();
				}
				if(onlineMusicSettings.repeat === true) {
					$(amplitudeRepeat).addClass('amplitude-repeat-on');
					Amplitude.setRepeat();
				}
				//Скоролинг вверх
				scrollTopDown(musicItems);
			}, ajaxPreloader);
		},
		onlineMusicInformation(url) {
			infoHtml = '';
			$(infoSong).empty();
			this.onlineMusicRequest(url, (data) => {
				//console.log(data);
				let info = $(data).find('ul.finfo');
				let infoTitle = $(data).find('.fright h1 span').text();
				let infoFormat = $(info).children('li').eq(1).children('span')[0].nextSibling.data;
				let infoSize = $(info).children('li').eq(2).children('span')[0].nextSibling.data;
				let infoBitrate = $(info).children('li').eq(3).children('span')[0].nextSibling.data;
				let infoTime = $(info).children('li').eq(4).children('span')[0].nextSibling.data.trim();
				let infoDownloadLink = `${musicUrl}${$(data).find('.fplay').attr('data-file')}`;
				infoHtml = 
				`
					<ul>
						<h1>${infoTitle}</h1>
						<li>Формат: <span>${infoFormat}</span></li>
						<li>Размер: <span>${infoSize}</span></li>
						<li>Битрейт: <span>${infoBitrate}</span></li>
						<li>Длитетльность: <span>0${infoTime}</span></li>
						<li><a href="${infoDownloadLink}">Скачать</a></li>
					</ul>
				`
				$(infoSong).append(infoHtml);
				$(infoBox).addClass('info-on');
			}, true);
		}
	}
	//Вызываем приложения
	onlineMusicApp.onlineMusicPlay(musicPopUrl);
	//События
	$(musicBtns).on('click', function(e) {
		e.preventDefault();
		switch($(this).attr('data-btn')){
			case 'menu' : console.log(1);
				break;
			case 'playlist' : 
				$(playerPlaylist).toggleClass('player-playlist_on');
				$(player).toggleClass('player-off');
				break;
			case 'info-close' : $(infoBox).removeClass('info-on');
				break;
			case 'player-search' : 
			$(playerSearchBox).addClass('player__search-on');
			$(playerSeachInput).focus();
				break;
			case 'close-search' : $(playerSearchBox).removeClass('player__search-on');
				break;
			case 'music-search' : onlineMusicApp.onlineMusicPlay(`${musicSearchUrl}${playerSeachInput.val()}`, true);
				break;
			case 'shuffle' : 
				if($(this).hasClass('amplitude-shuffle-on') === true) {
					onlineMusicSettings.shuffle = false;
					reloadSettings();
				}else{
					onlineMusicSettings.shuffle = true;
					reloadSettings();
				}
				break;
			case 'repeat' : 
				if($(this).hasClass('amplitude-repeat-on') === true) {
					onlineMusicSettings.repeat = false;
					reloadSettings();
				}else{
					onlineMusicSettings.repeat = true;
					reloadSettings();
				}
				break;
			case 'library' : onlineMusicApp.onlineMusicPlay(musicPopUrl, true);
				break;
			default : return false;
				break;
		}
	});
	//Вызов окна информации
	$(musicItems).on('click', 'a.song__option', function(e) {
		e.preventDefault();
		let dataHref = $(this).attr('data-href');
		onlineMusicApp.onlineMusicInformation(dataHref);
	});
	//Функции
	//Запуск настрояк
	function reloadSettings() {
		localStorage.setItem('music-settings', JSON.stringify(onlineMusicSettings));
	}
	reloadSettings();
	//ScrollTopDown
	function scrollTopDown(el){
		$(el).animate({
			'scrollTop': 0
		}, onlineMusicSettings.animateTimer);
	}
})();