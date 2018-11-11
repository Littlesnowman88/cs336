"use strict";
$( document ).ready(function() {

    var idForm = $("#idQuery");

    $("#getData").click(function(event) {
        event.preventDefault();
        //make a GET request to the server (specifically, /hello), sending a small json of data.
        //then, append appropriate text to the right of the get_data button
        //BUG: appends text to previously existing text every time button is pressed.
          //this bug is allowed by the instructions, though, so I am letting it go.
          //the text does disappear upon refreshing the page.

        $.ajax({
          url: "/fetchPerson",
          data: {"loginID" : idForm.value}, //TODO: FIXME GET THE RIGHT DATA WORKING IN HERE.
          type: "GET",
          dataType: "json"
        })
        .done(function( json ) { //if success, use the name to print half-sized text
          $("<em>", {html: json}).css("fontSize", ".5em").appendTo("#formContainer");
        })
        .fail(function(xhr, status, errorThrown) { //if fail, send an alert, log problems to the console, and print helpful, half-sized text.
          alert( "Sorry, there was a problem!");
          console.log( "Error: " + errorThrown);
          console.log( "Status: " + status);
          console.dir( xhr);
          $("<em>", {html: "no data yet..."}).css("fontSize", ".5em").appendTo("#formContainer");
        })
        .always(function(xhr, status) {
          alert( "The request is complete!");
        });

    });
});
