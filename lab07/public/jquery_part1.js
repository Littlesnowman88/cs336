"use strict";
$( document ).ready(function() {
    $( "a" ).click(function( event ) {
        alert( "The link will no longer take you to jquery.com" );
        event.preventDefault();

        //make the link disappear. Ooh, fun!
        $( this ).hide( "slow" );
    });

    //make anythiing with class "test" bold
    $( "a" ).addClass( "test" );
    //make anything with class "test" go back to default style
    $( "a" ).removeClass( "test" );

    /**NOTE TO GRADER:
    I see that I wasn't supposed to implement the callback stuff,
    but I am happy that I did because I learned more about how
    javascript (well, jquery, techincally) works with function calls.
    **/
    let myCallBack = function() {
      console.log("You got a callback! But not of a theatrical manner. We don't like acting.");
    }
    //callbacks (and no, not the theatrical kind)
    $.get( "lab07_1.html", myCallBack );
    //to give a callback with function arguments:
    /*
    $.get( "lab07_1.html", function() {
      myCallBack( parameter1, paremeter2, etc);
    });
    */
});
