var BASE_URL = 'https://vinylcollectionbackend.herokuapp.com/'

$.ajaxSetup({
  beforeSend: function (req) {
    req.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('id_token'))
  }
})
lock = new Auth0Lock('pEHzAyBzuwg3oVXnGRorL9Oe7FT68uXw', 'seesharp.auth0.com', {
       auth: {
           params: { scope: 'openid email' } //Details: https:///scopes
       }
   });
 // Listening for the authenticated event
lock.on("authenticated", function(authResult) {
  // Use the token in authResult to getProfile() and save it to localStorage
  lock.getProfile(authResult.idToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    };
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('profile', JSON.stringify(profile));
    loadBandsApp()
  });
});

$(document).ready(function() {

    loadAlbums()
        //hover state
    deleteAlbum()
    searchDiscogs()
    addAlbum()

    //Search Discogs for albums
    function searchDiscogs() {
        $('.discogs-form').on('submit', function(e) {
            e.preventDefault();
            var apiSearch = $('.discogs-input').val();
            var searchResults = $('.search-results');
            $.ajax({
                url: 'https://api.discogs.com/database/search?artist=' + apiSearch + '&key=jbUTpFhLTiyyHgLRoBgq&secret=LSQDaLpplgcCGlkzujkHyUkxImNlWVoI',
                method: 'GET',
            }).done(function(data) {
                $('.discogs-input').val('').focus();
                searchResults.html('');
                for (var i = 0; i < data.results.length; i++) {
                    var div = $('<div></div>');
                    var p = $('<p></p>');
                    div.html('<img src="' + data.results[i].thumb + '" />');
                    p.html(data.results[i].title);
                    div.append(p);
                    var a = $('<a><span class="icon-plus2">Add to Library</span></a>');     
                    a.attr('href', BASE_URL + 'albums/');   
                    a.data('artist', data.results[i].artist);
                    a.data('album', data.results[i].title);
                    a.data('year', data.results[i].year);
                    a.data('art', data.results[i].thumb);
                    a.addClass('addAlbum');    
                    div.append(a);    
                    searchResults.prepend(div);

                }
            })
        })
    };

    //add album to library
  function addAlbum() {
      $(document).on('click', 'a.addAlbum', function(e) {  
          e.preventDefault()  
          var link = $(this)  
          $.ajax({   
              url: link.attr('href'),
                 method: 'POST',
              data: {
                  artist: link.data('artist'),
                  album: link.data('album'),
                  year: link.data('year'),
                  art: link.data('art')
              }  
          })  .done(function() {
              loadAlbums()
              link.parent('div').remove()  
          }) 
      })
  }






    //Search personal Catalog
    // function searchLibrary() {
    //
    // }



    function loadAlbums() {
        $('.collection').empty()
        $.ajax({ 
            url: BASE_URL + 'albums/',
            method: 'GET' 
        }).done(function(albums) {  
            albums.forEach(function(albums) {   
                loadAlbum(albums)                      
            }) 
        })
    }

    function loadAlbum(album) {

        // console.log(album.album + ' ' + album.artist + ' ' + album.year);
        var div = $('<div></div>');
        var p = $('<p></p>');

        div.html('<img src="' + album.art + '" />');
        p.html(+' ' + album.album + ' ' + album.artist + ' ' + album.year);
        div.append(p);


        var a = $('<a><span class="icon-trash2"></br>Delete</span></a>');     
        a.attr('href', BASE_URL + 'albums/' + album._id);    
        a.addClass('deleteAlbum');    
        div.append(a);    
        $('.collection').prepend(div);
    }

    function deleteAlbum() {
        $(document).on('click', 'a.deleteAlbum', function(e) {  
            e.preventDefault()  
            var link = $(this)  
            $.ajax({   
                url: link.attr('href'),
                   method: 'DELETE'  
            })  .done(function() {   
                link.parent('div').remove()  
            }) 
        })
    }
    var expanded = false;
    $(".discogs-form").on("submit", function() {
        if (expanded = !expanded) {
            $("#drawer-content").animate({
                "margin-right": 0
            }, "slow");
        }
    });
});
