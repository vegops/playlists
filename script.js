"use strict";

const allPlaylists = [];
$( document ).ready(function() {
    console.log( "ready!" );

    const getAlbums = ({isFirst, searchBy}) => {
        $('#album-list').html('');
        $.get('api/playlist', function (result) {
            let albums = result['data'];
            let filteredAlbums = searchBy ? albums.filter(album=> {
                return album.name.toLowerCase().includes(searchBy.toLowerCase()) ? album : null;
            }) : albums;
            $.each(filteredAlbums, function (i, e) {
                let list = new Playlist(this['id'], this['name'], this['image']);
                let playlist = list.build(isFirst);
                $('#album-list').append(playlist);
            });

            if($('#album-list').html() ==="") { $('#album-list').html('<div class="empty-list">it\'s quite boring here, try adding a playlist!</div>') }

            $('.playlist-image').click(function () { //show song list in album
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
                        songList.toggleClass('open');
                        let height = songList.find('.song-list-sheet').height()+134;
                        height > 300 ? height = 300 : height;
                        songList.css('height',height);
                    },300);
                };
                $('ol.song-list-sheet li').click(function () { //adding click event (play song and append list to player list) for songs in the list
                    $('#pause').trigger('click');
                    $('#player').attr('src',$(this).attr('data-link'))
                        .attr('data-index',$(this).attr('data-index'));;
                    const list = $(this).closest('.playlist').find('ol').clone();
                    const img = $(this).closest('.playlist').find('.playlist-image:first').clone().addClass('paused');
                    if (img.attr('src') === $('.left .playlist-image').attr('src') ) { // checks if player img is same as album img
                        $('#play').trigger('click');
                    } else { // if player img is not same as album img - replaces to new img
                        $('div.right').html(list);
                        $('.needle').toggleClass('active');
                        setTimeout(()=>{
                            $('.needle').toggleClass('active');
                            $('div.left').html(img);
                            setTimeout(()=>{
                                $('#play').trigger('click');
                            },1200);
                        },600)
                    }
                    $('.right ol li').click(function () { // adds click event to appended list in player
                        $('#player').attr('src',$(this).attr('data-link'))
                            .attr('data-index',$(this).attr('data-index'));
                        $('#play').trigger('click');
                        $('.needle').toggleClass('needle-up');
                        setTimeout(()=>{
                            const angle = $(this).index()+5;
                            $('.needle').toggleClass('needle-up');
                            $('.needle').css('transform','rotate('+angle+'deg)')
                        },400);
                    });
                });
            });
            $('.playlist i.delete').click(function(){ // delete playlist
                const playlist = $(this).closest('.playlist');
                if( playlist.hasClass('opened') ) { playlist.find('.playlist-image')[0].click(true); };
                $(this).closest('.playlist').css('transform','rotateY(180deg)');
                $(this).closest('.playlist').find('.playlist-del').fadeIn();

            });
            $('.playlist .confirm-del').click(function () { // confirm before playlist delete
                const id = $(this).closest('.playlist').attr('data-id');
                $.delete('./api/playlist/'+id,function (result) {
                    console.log(result);
                })
                    .success(()=>{
                        swal('Done!','Your playlist was deleted!','success');
                        getAlbums({isFirst: 'yes'});
                    })
                    .fail(()=>{swal(
                        'Oops...',
                        'Something went wrong!',
                        'error'
                    )});
            });

            $('.playlist .cancel-del').click(function () { // cancel playlist delete on confirm box
                $(this).closest('.playlist').find('.playlist-del').fadeOut();
                $(this).closest('.playlist').css('transform','rotateY(0deg)');
            });

            $('.play').click(function () { // play playlist and append list and img to player
                $('.needle').removeAttr('style');
                $('#pause').trigger('click');
                $('.needle').toggleClass('active');
                const list = $(this).closest('.playlist').find('ol').clone();
                const img = $(this).closest('.playlist').find('.playlist-image:first').clone().addClass('paused');
                $('div.right').html(list);
                const songItem = $(this).closest('.playlist').find('ol li:first');
                $('#player').attr('src',songItem.attr('data-link'))
                    .attr('data-index',songItem.attr('data-index'));
                setTimeout(()=>{
                    $('.needle').toggleClass('active');
                    $('div.left').html(img);
                    setTimeout(()=>{
                        $('#play').trigger('click');
                    },1200);
                },600)
                $('.mid h5').html($(this).closest('.playlist').find('ol li:first').text())
                list.find('li').off('click');
                    $('#pause').trigger('click');
                    $('.right ol li').click(function () {
                        $('#player').attr('src',$(this).attr('data-link'))
                            .attr('data-index',$(this).attr('data-index'));
                        $('#play').trigger('click');
                        $('.needle').toggleClass('needle-up');
                        setTimeout(()=>{
                            const angle = $(this).index()+5;
                            $('.needle').toggleClass('needle-up');
                            $('.needle').css('transform','rotate('+angle+'deg)')
                        },400);
                    });
                });
                $('.playlist-player .edit').click(function () {
                    $('#update').slideDown();
                });
        })
    };
    getAlbums({isFirst: 'yes'}); // retrives all albums
    $('.bgcontainer').draggable(); // make player draggable

    $('.add-playlist').click(function () {
        $('#new').slideDown();
    });
    $('.form-block i.fa-times').click(function(){
        $(this).closest('.form-block').slideUp();
    })
    $('.bgcontainer').mouseup(function () {
        $(this).css('background','#130419');
    })
    
    $('#add-song').click(function () { // add song input to new playlist form
        const song = $('#song-box').clone();
        $('.new-list-songs').append(song.hide());
        song.append('<i class="fa fa-trash song-remove" aria-hidden="true"></i>\n')
        song.removeAttr('id').slideDown().find('input').val('');
        $('.song-remove').click(function () {
            $(this).closest('.song').slideUp();
            setTimeout(()=>{$(this).closest('.song').remove();},500);
        });
    })
    
    $('#new div.new-playlist').submit(function(e) { // new playlist form submit action
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
                name: $(this).find('input[name="song"]').val().replace('.mp3',''),
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
                getAlbums({isFirst: 'yes'});
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

    $('#update .new-playlist').submit(function(){

    });

    $('.forms').click(function(){
        $(this).find('.form-block').slideUp();
    });
    $('.new-playlist').click(function(e){
        e.stopPropagation();
    });
    $('.search-playlist').click(function(){
        $('.search-form').slideToggle();
    });

    $('.new-playlist #image').change(function(){
        let image = $(this).val();
        $('.new-playlist-image').html('');
        $('.new-playlist-image').append('<img src="'+image+'">').fadeIn();
        $('.new-playlist-image img').error(function(){
            $('.new-playlist-image').html('');
            $('.new-playlist-image').append('<div> Can not load this image</div><i class="fa fa-chain-broken" aria-hidden="true"></i>').fadeIn();
        })
    });

    // filter albums
    $('#search').keyup(function(e){
        let searchTerm = $(this).val();
        getAlbums({isFirst: 'no', searchBy: searchTerm });
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
    build(isFirst) {
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
        playlist.append(finalLabel, image, player, songsList, delBox);

        $.get('./api/playlist/'+this.id+'/songs', result => { // retrives song list for each playlist
            result.data.songs.forEach(function (item, index) {
                songsList.find('.song-list-sheet').append('<li data-link="'+item.url+'" data-index="'+(1+index)+'">'+item.name+'</li>');
            });
            if (isFirst==="yes") {
                allPlaylists.push({id: this.id, name: this.name, image: this.image, songs: result.data.songs });
            } else {
                console.log("not first: "+this.name);
            }
        });
        return playlist;
    };

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



























