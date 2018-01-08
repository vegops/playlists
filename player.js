"use strict";
window.enableContentLengthHeader = 0
$( document ).ready(function() {
    const play = $('#play');
    const pause = $('#pause');
    const volUp = $('#vol-up');
    const volDn = $('#vol-dn');
    const volNn = $('#vol-none');
    let player = $('#player')[0];
    let songTime = $('#song-total');
    let songCurrentTime = $('#song-now');
    setTimeout(()=>{
        songTime.html(fixSongTime(player.duration));
        },500,);
    let volume = $('#player').prop('volume',.9);
    let timeCounter;
    let progressBar = $('#progress-bar');

    play.click(function(){
        var playPromise = player.play();

        if (playPromise !== undefined) {
          playPromise.then(_ => {
            // console.log('song is playing');
          })
          .catch(error => {
            pause.trigger('click');
            // console.log('song promise failed=> '+error)
          });
        }
        $(this).hide();
        pause.show();
        timeCounter = setInterval(trackTimer,500);
        let img = $('.left .playlist-image');
        img.hasClass('paused') ? img.toggleClass('paused'): null;
        const duration = new Promise((resolve, reject) => {
            let durationIntrvl;
            if (!isNaN(player.duration)) {
                resolve(player.duration);
            } else {
                durationIntrvl = setInterval((i=0)=>{
                    if (!isNaN(player.duration)) {
                        resolve(player.duration);
                        window.clearInterval(durationIntrvl);
                        songTime.html( fixSongTime(player.duration));
                    } else {
                        songTime.html( '00-00' );
                    };
                    i++;
                    if(i === 10) {
                        window.clearInterval(durationIntrvl);
                        reject(console.log('error'));
                    }
                },500)
            }
        });
        duration.then(function(){
            const playingSong = $('.right ol li[data-index="'+$(player).attr('data-index')+'"]');
            $('.right ol li').removeClass('playing');
            playingSong.addClass('playing');
        })
        duration.then(!isNaN(player.duration) ? songTime.html( fixSongTime(player.duration)) : '00-00');
    });
    pause.click(function(){
        player.pause();
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
        if(player.ended) {
            songCurrentTime.html('00:00');
            progressBar.css('width',0);
            pause.trigger('click');
            $('#next').trigger('click');
        } else {
            songCurrentTime.html(fixSongTime(player.currentTime));
            let width = player.currentTime / player.duration;
            progressBar.css('width', width * 100 + '%');
        }
    }

    
    function fixSongTime(number) {
        if ( isNaN(number) ) {
            return '00-00';
        }   else
        {
            let min = (number / 60).toFixed(0);
            let sec = (number % 60).toFixed(0);
            min < 10 ? min = `0 ${min}` : min;
            sec < 10 ? sec = `0 ${sec}` : sec;
            return `${min} : ${sec}`;
        }
    }
    function volumeValue() {
        volume = $('#player').prop('volume');
        if (volume >= 0.99) {
            volUp.hide();
            volDn.show();
        }else if (volume <= 0.1 ) {
            volDn.hide();
            volUp.show();
        } else {
            volUp.show();
            volDn.show();
        }
        $('.current-vol').css('width',volume*100+'%');
        $('#current-vol').val(volume*100);
    };

    $('#next').on('click',() => { playSong({
        song: $('.right ol li[data-index="'+$(player).attr('data-index')+'"]'),
        action: "next"
            });
        });
    $('#previous').on('click',() => { playSong({
        song: $('.right ol li[data-index="'+$(player).attr('data-index')+'"]'),
        action: "previous"
            });
        });
  

    function playSong ({song, action}) { // playing next / previous song based on action argument 
        pause.trigger('click');
        if (song.next() && action === "next") {       
            let nextSong = song.next();
            $(player).attr('src', nextSong.attr('data-link'))
                    .attr('data-index',nextSong.attr('data-index'));
            play.trigger('click');

        } else if (song.prev() && action === "previous") {        
            let prevSong = song.prev();
            $(player).attr('src', prevSong.attr('data-link'))
                    .attr('data-index',prevSong.attr('data-index'));
            play.trigger('click');

        } else {
            // console.log("none=> "+action)
        }

    };
    volumeValue();

});