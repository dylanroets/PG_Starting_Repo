$(document).ready(onReady);

function onReady() {
    getSongs();
    $('#add').on('click', postSong);
    $('#filter-btn').on('click', getByArtist);
    $('#songsTableBody').on('click', '.delete-btn', deleteSong);
    $('#songsTableBody').on('click', '.rank-btn', updateRank);   
}

// get artist data from the server
function getSongs() {
    $("#songsTableBody").empty();
    $.ajax({
        type: 'GET',
        url: '/songs'
    }).then(function (response) {
        console.log("GET /songs response", response);
        // append data to the DOM
        for (let i = 0; i < response.length; i++) {
            $('#songsTableBody').append(`
                <tr>
                    <td>${response[i].artist}</td>
                    <td>${response[i].track}</td>
                    <td>${response[i].rank}</td>
                    <td>${response[i].published}</td>
                    <td>
                        <button 
                            class="delete-btn" 
                            data-id="${response[i].id}"
                        >Delete</button>
                        
                        <button 
                            class="rank-btn"
                            data-id="${response[i].id}"
                            data-direction="up"
                        >Upvote</button>
                        
                        <button
                            class="rank-btn"
                            data-id="${response[i].id}"
                            data-direction="down"
                        >Downvote</button>
                    </td>
                </tr>
            `);
        }
    });
}

function getByArtist() {
    $("#songsTableBody").empty();
    const artist = $('#artist-filter').val();
    $.ajax({
        type: 'GET',
        url: `/songs/${artist}`
    }).then(function (response) {
        console.log("GET /songs/:artist response", response);
        // append data to the DOM
        for (let i = 0; i < response.length; i++) {
            $('#songsTableBody').append(`
                <tr>
                    <td>${response[i].artist}</td>
                    <td>${response[i].track}</td>
                    <td>${response[i].rank}</td>
                    <td>${response[i].published}</td>
                </tr>
            `);
        }
    });
}

function postSong() {
    let payloadObject = {
        artist: $('#artist').val(),
        track: $('#track').val(),
        rank: $('#rank').val(),
        published: $('#published').val()
    }
    $.ajax({
        type: 'POST',
        url: '/songs',
        data: payloadObject
    }).then( function (response) {
        $('#artist').val(''),
        $('#track').val(''),
        $('#rank').val(''),
        $('#published').val('')
        getSongs();
    });
}

function deleteSong() {
    const songId = $(this).data('id');
    console.log('in delete song');
    $.ajax({
        method: 'DELETE',
        url: `/songs/${songId}`
    })
    .then(function() {
        getSongs();
    })
    .catch(function(error) {
        alert(`OH NO NOT SO GOOD ${error}`);
    });
}

function updateRank() {
    const id = $(this).data('id');
    const direction = $(this).data('direction');
    $.ajax({
        method: 'PUT',
        url: `/songs/rank/${id}`,
        data: {
            direction: direction
        }
    })
    .then(function() {
        getSongs();
    })
    .catch(function(error) {
        alert('things are bad', error);
    })
}