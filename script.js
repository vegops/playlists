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
        $.post('./api/playlist',data ,function (result) {
            console.log("response:");
            console.log(result);
        })
            .success(()=>{
                swal('Done!','Your playlist was added!','success');
                $('#new input').not('.submit').val('').closest('#new').fadeOut();
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



























