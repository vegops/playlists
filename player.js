$( document ).ready(function() {
    const play = $('#play');
    const pause = $('#pause');
    const volUp = $('#vol-up');
    const volDn = $('#vol-dn');
    const volNn = $('#vol-none');
    let song = $('#player')[0];
    let songTime = $('#song-total');
    let songCurrentTime = $('#song-now');
    setTimeout(()=>{
        songTime.html(fixSongTime(song.duration));
        },500,);
    let volume = $('#player').prop('volume',.9);
    let timeCounter;
    let progressBar = $('#progress-bar');

    play.click(function(n){
        $(this).hide();
        pause.show();
        timeCounter = setInterval(trackTimer,500);
        var img = $('.left .playlist-image');
        img.hasClass('paused') ? img.toggleClass('paused'): null;
        const duration = new Promise((resolve, reject) => {
            if (isNaN(song.duration)) {
                resolve(song.duration);
            } else {
                reject(
                    setTimeout(()=>{
                        resolve(song.duration)
                    },500)
                )
            }
        });
        duration.then(songTime.html( fixSongTime(song.duration)));

        debugger;
    });
    pause.click(function(){
        $(this).hide();
        play.show();
        window.clearInterval(timeCounter);
        const matrix = $('.left img').css('transform');
        $('.left .playlist-image').toggleClass('paused').css('transform',matrix);
    });

    $('.vol').click(function(){
        volumeValue();
    });

    $('#current-vol').val(90);
    $('#current-vol').mousedown(function () {
        setVol($(this));
    });
    $('#current-vol').mouseup(function () {
        setVol($(this))
    })

    function setVol(element) {
        $('#player').prop('volume',element.val()/100);
        $('.current-vol').css('width',element.val()+'%');
        volumeValue();
    }

    function trackTimer() {
        if(song.ended) {
            songCurrentTime.html('00:00');
            progressBar.css('width',0);
            pause.trigger('click');
        } else {
            songCurrentTime.html(fixSongTime(song.currentTime));
            let width = song.currentTime / song.duration;
            progressBar.css('width', width * 100 + '%');
        }
    }

    
    function fixSongTime(number) {
        let min = (number/60).toFixed(0);
        let sec = (number%60).toFixed(0);
        min < 10 ? min = `0 ${min}` : min;
        sec < 10 ? sec = `0 ${sec}` : sec;
        return `${min} : ${sec}`;
    }
    function volumeValue() {
        volume = $('#player').prop('volume');
        if (volume >= 1) {
            volUp.hide();
            volNn.show();
            volDn.show();
        }else if (volume <= 0.1 ) {
            volDn.hide();
            volNn.show();
            volUp.show();
        } else {
            volUp.show();
            volDn.show();
            volNn.hide();
        }
        $('.current-vol').css('width',volume*100+'%');
        $('#current-vol').val(volume*100);
    };
    volumeValue();

});