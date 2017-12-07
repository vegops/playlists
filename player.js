$( document ).ready(function() {
    const play = $('#play');
    const pause = $('#pause');
    const volUp = $('#vol-up');
    const volDn = $('#vol-dn');
    const volNn = $('#vol-none');
    let song;
    let songTime = $('#song-total');
    let songCurrentTime = $('#song-now');
    setTimeout(()=>{
        song = $('#player')[0];
        songTime.html(fixSongTime(song.duration));
        },500,);
    let volume = $('#player').prop('volume',.9);
    let timeCounter;
    let progressBar = $('#progress-bar');

    play.click(function(){
        $(this).hide();
        pause.show();
        timeCounter = setInterval(trackTimer,500);
    });
    pause.click(function(){
        $(this).hide();
        play.show();
        window.clearInterval(timeCounter);
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

    // songTime.html(fixSongTime(song.duration));
    console.log(song);

    function trackTimer() {
        if(song.ended) {
            songCurrentTime.html('00:00');
            progressBar.css('width',0);
            play.click(true);
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
        console.log(volume);
        $('.current-vol').css('width',volume*100+'%');
        $('#current-vol').val(volume*100);
    };
    volumeValue();

});