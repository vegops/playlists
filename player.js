$( document ).ready(function() {
    const play = $('#play');
    const pause = $('#pause');
    const volUp = $('#vol-up');
    const volDn = $('#vol-dn');
    const volNn = $('#vol-none');
    const song = $('#player')[0];
    let volume = $('#player').prop('volume',0.9);
    let timeCounter = setInterval(trackTimer,500);
    let progressBar = $('#progress-bar');
    play.click(function(){
        $(this).hide();
        pause.show();
        setInterval(trackTimer,500);
    });
    pause.click(function(){
        $(this).hide();
        play.show();
        window.clearInterval(timeCounter);
    });
    $('.vol').click(function(){
        volumeValue();
    });

    let duration = $('#song-total');
    let current = $('#song-now');

    duration.html(fixSongTime(song.duration));

    function trackTimer() {
        if(song.ended) {
            current.html('00:00');
            progressBar.css('width',0);
        } else {
            current.html(fixSongTime(song.currentTime));
            let width = song.currentTime / song.duration;
            console.log(width);
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
        }else if (volume <= 0.2 ) {
            volDn.hide();
            volNn.show();
        } else {
            volUp.show();
            volDn.show();
            volNn.hide();
        }
        console.log(volume);
    };
    volumeValue();

});