//* --------------------- *//
//* Global variables      *//
//* --------------------- *//
var spotifyAlbumsAPI = "https://api.spotify.com/v1/search?q=album:arrival&type=album";
var spotifyAlbumAPI  = "";
var jqxhr, jqxhrAlbum;
var spotifyReturn, spotifyAlbumReturn;
var albumArray = [];
var albumSearch = "";
var albumArtClass = ".album-art";
var albumHTML = "";
//* --------------------- *//
//* DOM variables         *//
//* --------------------- *//

//* --------------------- *//
//* jQuery variables      *//
//* --------------------- *//
 const $search = $("#search");
 const $albumsID = $('#albums');
 const $desc = $('.desc');
 const $mainHeader = $('.main-header');
 const $mainContent = $('.main-content');
 var $albumWrap = "";
 var $albumArt = "";
 
//*  set search field focus. Everything else triggers off of events *//
 $('#search').focus();
//* --------------------- *//
//* Function section      *//
//* --------------------- *//

//function processAlbumsData(data) {
const processAlbumsData = (data) => {	
	var albumsHTML = "";
	$('.desc').remove();																			// remove description class
	$('.no-albums').remove();																	// remove not found HTML
	$('.album').remove();																			// remove album.. I added class album to the <li> below.
	$albumArt = {};
	if (data.albums.items.length > 0) {												// if there is information about the requested album
		albumArray = data.albums.items;													// store the entire array about albums for onClick.
		$.each(data.albums.items, function(i,itemArray) {
			console.log("item:" + i + " is: "+ itemArray.name);		// itemArray.name is the album name.
			albumsHTML += '<li class="album"> <div class="album-wrap">';
			albumsHTML += '<img class="album-art" src="' + itemArray.images[0].url + '"></div>';
      albumsHTML += '<a href=' + itemArray.external_urls.spotify + ' target="_blank"><span class="album-title">' + itemArray.name + '</span></a>';
      albumsHTML += '<span class="album-artist">' + itemArray.artists[0].name +'</span></li>';
		});
		albumsHTML += '</li>'
	} else {																									// otherwise, we did not find a matching album.
		albumsHTML = '<li class="no-albums"> <i class="material-icons icon-help">help_outline</i>No albums found that match: [search form value].</li>';
	};  // end if	
	
	$albumsID.append(albumsHTML);										// append in our html.
	$albumArt = $(albumArtClass);										// reset the $albumArt jQuery array

	$albumArt.click(function () {										// rebind the click event.
		let index = $albumArt.index( this );					// get which one was clicked
		setAlbumHTML(index, spotifyReturn.albums.items[index].name, spotifyReturn.albums.items[index].artists[0].name, spotifyReturn.albums.items[index].images[0].url);													// call to get album
	});
};

//function setAlbumHTML(index, albumTitle, artistName, albumArtURL) {
const setAlbumHTML = (index, albumTitle, artistName, albumArtURL) => {
	albumHTML = "";																	// initialize the albumHTML for use
	spotifyAlbumAPI = albumArray[index].href;				// get the https data for another call to spotify
	$.getJSON(spotifyAlbumAPI, {
		// do nothing
	})
		.done(function (albumData) {
			// spotifyAlbumReturn = albumData; used during debugging.
			albumHTML = '<div id="album-wrap">'; //
			albumHTML += '<div id="album-header" class=main-content"><div id="albums-return" > &lt Search results </div>';						// 
			albumHTML += '<div class="main-content"><div id="album-art" class="four-cols"><img class="album-art" src=' + albumArtURL + '></div>';
			albumHTML += '<div class="eight-cols top-pad-60 left-pad-40"><ul id="album-title">' + albumTitle + ' (' + albumData.release_date.substr(0,4) + ')</ul><ul>' + artistName +'</ul></div>';				// 
			albumHTML += '</div></div>';
			albumHTML += '<div id="album-detail">'; 
			albumHTML += '<div id="track-list" class="eight-cols top-pad-30 left-pad-40"><span class="track-list"> track list:</span><ul class="font-size-1em top-pad-30">';
			for (let i = 0; i < albumData.tracks.items.length; i++) {
				albumHTML += '<li>' + (i +1) + '. ' + albumData.tracks.items[i].name + '</li>';	// this is the track name
			};
			albumHTML += '</ul></div></div>';
			$albumsID.hide();
			$mainHeader.after(albumHTML);								// put the albumHTML AFTER class main-header.
			$('#albums-return').click( function () {		// bind click event to return ID
				$albumsID.show();													// reshow the albums ID
				$('#album-wrap').remove();								// remove single album "page"
			});
	});
};

//* --------------------- *//
//*  Events  section      *//
//* --------------------- *//

$('form').submit(function (e) {
	e.preventDefault();															// prevent form submission.
	albumSearch = $search.val();										// grab search field
	albumSearch.split(" ").join("%20");							// change spaces to %20
	spotifyAlbumsAPI = "https://api.spotify.com/v1/search?q=album:" + albumSearch + "&type=album";
	jqxhr = $.getJSON(spotifyAlbumsAPI, function (data) { 
		spotifyReturn = data;
		processAlbumsData(data);
	});		
})// end .submit
