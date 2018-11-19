"use strict";
$( document ).ready(function() {
    $("#getPerson").submit(function(event) {
        event.preventDefault();

        $.ajax({
          type: "GET",
          url: "/person/" + $("#login").val(),
          success: function( json ) { //if success, use the name to print half-sized text
            $("<em>" + "<br>Name: " + json.firstName + " " + json.lastName + "<br>Start Date: " + json.startDate + "</em>").css("fontSize", "1.3em").appendTo("#getPerson");
          },
          error: function(xhr, status, errorThrown) { //if fail, send an alert, log problems to the console, and print helpful, half-sized text.
            alert( "Sorry, there was a problem!");
            console.log( "Error: " + errorThrown);
            console.log( "Status: " + status);
            console.dir( xhr);
            $("<em>" + "<br>Data not found for &#34;" + $("#login").val() + "&#34;." + "</em>").css("fontSize", ".5em").appendTo("#getPerson");
          }
        });
    });

    $("#addPerson").submit(function(event) {
        event.preventDefault();

        var form = $("#addPerson");

        $.ajax({
          type: "POST",
          url: "people",
          data: form.serialize(),
          dataType: "json",
          success: function( json ) { //if success, use the name to print half-sized text
            $("#resultText").html($("<em>" + "Person with record:" + "<br>Login ID: " + json.loginID + "<br>First Name: " + json.firstName + "<br>Last Name: " + json.lastName + "<br>Start Date: " + json.startDate + "<br>has been added to the citizens of Remnant!" + "</em>"));
            $("#resultText").css("fontSize", "1.3em");
            //CLEAR THE FORM
            $("#loginField").val("");
            $("#firstNameField").val("");
            $("#lastNameField").val("");
            $("#startDateField").val("");
          },
          error: function() {//xhr, status, errorThrown) { //if fail, send an alert, log problems to the console, and print helpful, half-sized text.
            /*FOR NOW: Since the console doesn't seem to log my error message from the server, it's being put here.
             * If my server ever throws a different error, THE SECOND SENTENCE NEEDS TO BE REMOVED FROM HERE.*/
            $("#resultText").html($("<em>" + "<br>Couldn't create person. Not all of the required fields have been filled in." + "</em>"));
            $("#resultText").css("fontSize", "1.3em");
            alert( "Sorry, there was a problem!");
            console.log( "Error: " + errorThrown);
            console.log( "Status: " + status);
            console.dir( xhr);
          }
        });
    });
});
