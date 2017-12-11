"use strict";
$( document ).ready(function() {
    console.log( "ready!" );

    const getAlbums = () => {
        $('#album-list').html('');
        $.get('api/playlist', function (result) {
            var albums = result['data'];
            $.each(albums, function (i, e) {
                var list = new Playlist(this['id'], this['name'], this['image']);
                list.build();
            });

            if($('#album-list').html() ==="") { $('#album-list').html('<div class="empty-list">it\'s quite boring here, try adding a playlist!</div>') }

            $('.playlist-image').click(function () {
                const playlist =  $(this).closest('.playlist');
                const songList = playlist.find('.songs-list');
                playlist.toggleClass('opened');
                if(songList.hasClass('open')){
                    songList.toggleClass('open');
                    songList.css('height',74);
                    setTimeout(()=>{
                        songList.toggleClass('show');
                    },300)
                }else {
                    songList.toggleClass('show');
                    setTimeout(()=>{
                        const height = songList.find('li').length*20+134;
                        songList.css('height',height);
                        songList.toggleClass('open');
                        console.log(height);
                    },300)
                };
            });
            $('.playlist i.delete').click(function(){
                const playlist = $(this).closest('.playlist');
                if( playlist.toggleClass('opened') ) { playlist.find('.playlist-image')[0].click(true); };
                $(this).closest('.playlist').css('transform','rotateY(180deg)');
                $(this).closest('.playlist').find('.playlist-del').fadeIn();

            });
            $('.playlist .confirm-del').click(function () {
                const id = $(this).closest('.playlist').attr('data-id');
                $.delete('./api/playlist/'+id,function (result) {
                    console.log(result);
                })
                    .success(()=>{
                        swal('Done!','Your playlist was deleted!','success');
                        getAlbums();
                    })
                    .fail(()=>{swal(
                        'Oops...',
                        'Something went wrong!',
                        'error'
                    )});
            });

            $('.playlist .cancel-del').click(function () {
                $(this).closest('.playlist').find('.playlist-del').fadeOut();
                $(this).closest('.playlist').css('transform','rotateY(0deg)');
            });
        });
    };
    getAlbums();
    $('.bgcontainer').draggable();

    $('.add-playlist').click(function () {
        $('#new').slideDown();
    });
    $('.form-block i.fa-times').click(function(){
        $(this).closest('.form-block').slideUp();
    })
    $('.bgcontainer').mouseup(function () {
        $(this).css('background','#130419');
    })
    
    $('#add-song').click(function () {
        const song = $('#song-box').clone();
        $('.new-list-songs').append(song.hide());
        song.append('<i class="fa fa-trash song-remove" aria-hidden="true"></i>\n')
        song.removeAttr('id').slideDown().find('input').val('');
        $('.song-remove').click(function () {
            $(this).closest('.song').slideUp();
            setTimeout(()=>{$(this).closest('.song').remove();},500);
        });
    })
    
    $('#new div.new-playlist').submit(function(e) {
        e.preventDefault();
        let reqFlag = 1;
        let listName = $('#new .new-playlist #name');
        let listImage = $('#new .new-playlist #image');
        if(listName.val().length > 20){
            reqFlag = 0;
            listName.closest('.new-list-name').find('.error').css('display','block');
        } else { listName.closest('.new-list-name').find('.error').hide(); }
        if(!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(listImage.val())){
            reqFlag = 0;
            listImage.closest('.new-list-img').find('.error').css('display','block');
        } else { listImage.closest('.new-list-img').find('.error').hide(); }

        let newSongs = [];
        $('.song').each(function (index) {
            newSongs.push({
                name: $(this).find('input[name="song"]').val(),
                url: $(this).find('input[name="link"]').val()
            })
        })
        let data = {
            name: listName.val(),
            image: listImage.val(),
            songs: newSongs
        };
        reqFlag === 1 ?
        $.post('./api/playlist',data ,function (result) {})
            .success(()=>{
                swal('Done!','Your playlist was added!','success');
                $('#new input').not('.submit').val('').closest('#new').fadeOut();
                getAlbums();
            })
            .fail(()=>{swal(
                'Oops...',
                'Something went wrong!',
                'error'
            )}) : swal(
            'Oops...',
            'Please fill the form correctly!',
            'error'
            ) ;
    });
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
        const finalLabel = $('<div>').addClass('playlist-name').attr('data',this.name);
        const label = this.name.toLowerCase().split("");
        const delBox = $('<div>').addClass('playlist-del');
        delBox.html('Delete this playlist?<div><i class="fa fa-check-circle confirm-del" aria-hidden="true"></i><i class="fa fa-times-circle cancel-del" aria-hidden="true"></i></div>');
        const songsList = $('<div>').addClass('songs-list').html('<ol class="song-list-sheet">');
        if (label.length<20) {
            let empty = (20-label.length)/2;
            while ( empty>0 ) { label.unshift(" "); label.push(" "); empty-- }
        }
        for( let i=0, z=label.length ; i<z ; i++ ) {
            const angle = 180/label.length;
            $('<span>').text(label[i]).addClass('letter').css('transform','rotate('+9*(i+1)+'deg').appendTo(finalLabel)
        };
        const image = $('<img>').addClass('playlist-image').attr('src',this.image);
        songsList.append(image.clone());
        const player = $('<div>');
        const del = '<i class="fa fa-times delete" aria-hidden="true"></i>';
        const edit = '<i class="fa fa-pencil edit" aria-hidden="true"></i>';
        const play = '<i class="fa fa-play-circle play" aria-hidden="true"></i>';

        player.addClass('playlist-player').append(del, edit, play);
        $('#album-list').append(playlist.append(finalLabel, image, player, songsList, delBox));

        $.get('./api/playlist/'+this.id+'/songs',function (result) {
            result.data.songs.forEach(function (item, index) {
                songsList.find('.song-list-sheet').append('<li data-link="'+item.url+'">'+item.name+'</li>');
            });
        })
    }

}
$.each( [ "put", "delete" ], function( i, method ) {
    jQuery[ method ] = function( url, data, callback, type ) {
        if ( jQuery.isFunction( data ) ) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        return jQuery.ajax({
            url: url,
            type: method,
            dataType: type,
            data: data,
            success: callback
        });
    };
});



























