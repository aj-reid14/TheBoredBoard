var firebaseConfig = {
    apiKey: "AIzaSyCEe4cKSqbkoj9DGmB2dPM6xTfTMrnCKcM",
    authDomain: "project-1-bored-board.firebaseapp.com",
    databaseURL: "https://project-1-bored-board.firebaseio.com",
    projectId: "project-1-bored-board",
    storageBucket: "project-1-bored-board.appspot.com",
    messagingSenderId: "934204858779",
    appId: "1:934204858779:web:5bb0a29eba5bf9f9a1413e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let database = firebase.database();

let newColor = "lightgreen";
let colorVals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "A", "B", "C", "D", "E", "F"]

$(document).ready(function () {
    ConfigureButtons();
    gapi.load("client");
});

function ConfigureButtons() {

    // "Bored Ball" on-click
    $("#bored-ball").click(function () {

        let color_r;
        let color_g;
        let color_b;
        
        let prevColor = $("#bored-text").css("color");

        database.ref("timesClicked").on("value", function (snapshot) {
            if (!snapshot.val())
                database.ref().set(0)
            else
                database.ref("timesClicked").set(snapshot.val())


            $("#bored-text").css("color", "yellow");
            setTimeout(function() {$("#bored-text").css("color", newColor);}, 200);
            $("#bored-text").text(snapshot.val());
        })

        database.ref("timesClicked").once("value", function (snapshot) {

            let totalClicks = 1 + snapshot.val();
            database.ref("timesClicked").set(totalClicks);

            if ((totalClicks % 25) === 0) {
                newColor = "#";
                for (let i = 0; i < 6; i++) {
                    newColor += colorVals[(Math.floor(Math.random() * 6) + 10)];
                }
                
                $("#bored-text").css("color", newColor);
            }

        })

        $("#bored-text").animate({ fontSize: "28px" }, {
            duration: 75,
            easing: "linear",
            done: function () {
                $("#bored-text").animate({ fontSize: "14px" }, { duration: 75, easing: "linear" });
            }
        })

        color_r = Math.floor(Math.random() * 256);
        color_g = Math.floor(Math.random() * 256);
        color_b = Math.floor(Math.random() * 256);

        $("#bored-ball").css("background-color", "rgba(" + color_r + ", " + color_g + ", " + color_b + ", " + 0.8 + ")");
    })

    // Level 1 Button Code
    $("#level1").click(function () {
        $("#start-page").hide();
        $("#joke-page").show();

        let giphyURL = "https://official-joke-api.appspot.com/random_ten";

        $.ajax({
            url: giphyURL,
            method: "GET"
        })
            .then(function (response) {
                // console.log(response)

                let jokeSetup = $("<div>" + response[1].setup + "</div>");
                $("#jokeSetup").html(jokeSetup);

                let jokeDelivery = $("<div>" + response[1].punchline + "</div>");
                $("#jokeDelivery").html(jokeDelivery);
                // console.log(response[1].punchline);
            });

        let jokeGIFapi = "5aq9ySNcbmDa3eP7R5B0OdOaJBvYihlY"
        let jokeGIFurl = "https://api.giphy.com/v1/gifs/random?api_key=" + jokeGIFapi;

        $.ajax({
            url: jokeGIFurl,
            method: "GET"
        }).then(function (response) {
            let newDIV = $("<div>");
            // console.log(response);

            let newGIF = $("<img>");
            newGIF.addClass("media");
            newGIF.attr("src", response.data.image_original_url);

            newDIV.append(newGIF);
            $("#jokeGIF").html(newDIV);

        })

    })

    $("#like").click(function() {
        database.ref("jokesLiked").once("value", function(snapshot) {
            let totalLikes = snapshot.val() + 1;

            database.ref("jokesLiked").set(totalLikes);

            if (totalLikes === 1)
                $("#global-message").text(totalLikes + " person liked a joke");
            else
                $("#global-message").text(totalLikes + " people liked a joke");

            $("#global-message").fadeIn();
            setTimeout(function () { $("#global-message").fadeOut(); }, 3000);
            
        })
    })
    
    $("#dislike").click(function() {
        database.ref("jokesDisliked").once("value", function(snapshot) {
            let totalDislikes = snapshot.val() + 1;

            database.ref("jokesDisliked").set(totalDislikes);

            if (totalDislikes === 1)
                $("#global-message").text(totalDislikes + " person got confused");
            else
                $("#global-message").text(totalDislikes + " people got confused");

            $("#global-message").fadeIn();
            setTimeout(function () { $("#global-message").fadeOut(); }, 3000);
            
        })
    })

    // -----------------------

    $("#level2").click(function () {

        $("#start-page").hide();
        $("#media-page").show();

        loadClient();
    })

    // Level 3 Button Code
    $("#level3").click(function () {

        $("#start-page").hide();
        $("#event-page").show();

        $.ajax({
            url: "https://app.ticketmaster.com/discovery/v2/events.json?apikey=8WUUFHzUOAX0dQ43PlH9MnGXOQanNz4D&locale=*&city=Miami&size=200",
            method: "GET"
        }).then(function (response) {

            // console.log(response);

            let randomNumber = Math.floor(Math.random() * response._embedded.events.length);

            let randomEvent = response._embedded.events[randomNumber].url;
            // console.log(randomEvent)
            $("#link").attr("href", randomEvent);

            let eventName = response._embedded.events[randomNumber].name;
            $("#link").text(eventName);
            // console.log(eventName);

            let date = response._embedded.events[randomNumber].dates.start.localDate;
            $("#eventDate").text(date);
            // console.log(date);

            let img = response._embedded.events[randomNumber].images[4].url;
            $("#eventIMG").attr("src", img);
            // console.log(img);
        });
    });

    $("#eventBtn").click(function () {
        $("#level3").click()
    });

    $("#media-gif").click(function () {
        SearchGIF();
    })

    $("#media-video").click(function () {
        SearchVideo();
    })
    //On click back-button
    $(".go-back1").click(function () {
        $("#start-page").show();
        $("#joke-page").hide();
    });

    $("#go-back2").click(function () {
        $("#start-page").show();
        $("#media-page").hide();
    });

    $("#go-back3").click(function () {
        $("#start-page").show();
        $("#event-page").hide();
    });

    $("#test").click(function() {
        $("#global-message").text("This is a test");
        $("#global-message").fadeIn();
    })
}

function loadClient() {
    let youtubeAPI = "AIzaSyBMblqCRc-6Ddlvc3mHpkgxcLUAy6HSezs";
    gapi.client.setApiKey(youtubeAPI);
    console.log(youtubeAPI);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest").then(function () { console.log("GAPI client loaded") },
        function (err) { console.error("GAPI client not loaded...") });
}

function SearchVideo() {
    let searchKeys = ["funny", "news", "today", "breaking", "road", "amazing", "revenge", "fail", "moments", "nature", "wild", "illusion", "bored", "cringe", "tricks", "magic", "chill"];
    let randomSearch = searchKeys[Math.floor(Math.random() * 5)];
    return gapi.client.youtube.search.list({
        "part": "snippet",
        "maxResults": 50,
        "order": "date",
        "q": randomSearch,
        "type": "video"
    }).then(function (response) {
        let randomResult = Math.floor(Math.random() * response.result.items.length);
        let videoLink = "https://www.youtube.com/embed/" + response.result.items[randomResult].id.videoId;

        let newVideo = $("<iframe frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen>");
        newVideo.addClass("media");
        newVideo.attr("width", screen.width * 0.3);
        newVideo.attr("height", screen.height * 0.3);
        newVideo.attr("src", videoLink);

        $("#media-appear-here").html(newVideo);

    },
        function (err) { console.log(err) })
}

function SearchGIF() {
    let giphyAPI = "ZRqA9M0EnGRDwkZNjreUefK1gHCmbCcR";
    let giphyURL = "https://api.giphy.com/v1/gifs/random?api_key=" + giphyAPI;

    $.ajax({
        url: giphyURL,
        method: "GET"
    }).then(function (response) {
        let newGIF = $("<img>");
        newGIF.addClass("media");
        newGIF.attr("src", response.data.image_original_url);

        $("#media-appear-here").html(newGIF);
    })
}
