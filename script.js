"use strict";
$( document ).ready(function() {
    console.log( "ready!" );

    $.get('docs/data.json',function(data){
        console.log(data);
        var albums = data;
        $.each(albums, function(i, e){

            var list = new Playlist(this['name'], this['image']);
            list.build();
            console.log(list);
        });
        $('.playlist-image').click(()=>{

        })
    });

});

class Playlist {
    constructor (name, image) {
        this.name = name;
        this.image = image;
    }
    get() {
        return  this.name, this.image
    }
    build() {
        const playlist = $('<div>').addClass('playlist');
        const finalLabel = $('<div>').addClass('playlist-name');
        const label = this.name.toLowerCase().split("");
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
        $('.container').append(playlist.append(finalLabel, image, player));
    }
}



























