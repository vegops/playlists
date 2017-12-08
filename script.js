"use strict";
$( document ).ready(function() {
    console.log( "ready!" );

    $.get('api/playlist.php',{type:'playlist'},function(result){
        var albums = result['data'];
        $.each(albums, function(i, e){
            var list = new Playlist(this['id'], this['name'], this['image']);
            list.build();
        });
        $('.playlist-image').click(function() {
            $(this).closest('.playlist').find('.songs-list').slideToggle();
        })
    });
    $('.bgcontainer').draggable();

    $('.add-playlist').click(function () {
        swal({
            title: 'Add new playlist',
            input: 'email',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: (email) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        if (email === 'taken@example.com') {
                            swal.showValidationError(
                                'This email is already taken.'
                            )
                        }
                        resolve()
                    }, 2000)
                })
            },
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                swal({
                    type: 'success',
                    title: 'Ajax request finished!',
                    html: 'Submitted email: ' + result.email
                })
            }
        })
    })
});

class Playlist {
    constructor (id, name, image) {
        this.name = name;
        this.image = image;
        this.id = id;
        // this.songs = songs;
    }
    get() {
        return  this.name, this.image
    }
    build() {
        const playlist = $('<div>').addClass('playlist').attr('data-id',this.id);
        const finalLabel = $('<div>').addClass('playlist-name');
        const label = this.name.toLowerCase().split("");
        const songsList = $('<div>').addClass('songs-list closed').hide();
        if (label.length<20) {
            let empty = (20-label.length)/2;
            while ( empty>0 ) { label.unshift(" "); label.push(" "); empty-- }
        }
        for( var i=0 ; i<label.length ; i++ ) {
            const angle = 180/label.length;
            $('<span>').text(label[i]).addClass('letter').css('transform','rotate('+9*(i+1)+'deg').appendTo(finalLabel)
        };
        const image = $('<img>').addClass('playlist-image').attr('src',this.image);
        const player = $('<div>');
        const del = '<i class="fa fa-times delete" aria-hidden="true"></i>';
        const edit = '<i class="fa fa-pencil edit" aria-hidden="true"></i>';
        const play = '<i class="fa fa-play-circle play" aria-hidden="true"></i>';

        player.addClass('playlist-player').append(del, edit, play);
        $('.container').append(playlist.append(finalLabel, image, player, songsList));
    }
}



























