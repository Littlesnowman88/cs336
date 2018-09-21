/* PersonPrototype.js creates a Person object that includes name, birthdate, friends, and a greeting
 * Created by: Andrew Fulling (Littlesnowman88)
 * Date: 09/12/1996
 * For: CS 336 Lab 02
 */

//Exercise 2.1: Encapsulation
function Person(name, birthdate) {
  this.name=name;
  this.birthdate=birthdate;
  this.friend_list = [];
};
Person.prototype.setName = function(newName) {
  this.name=newName;
};

//Thanks to Naveen Jose on jsfiddle.net/codeandcloud/n33RJ/ for algorithm
Person.prototype.getAge = function() {
  var today_date = new Date();
  var birth_date = new Date(this.birthdate);
  var age = today_date.getFullYear() - birth_date.getFullYear();
  var month_difference = today_date.getMonth() - birth_date.getMonth();
  // if today is before the person's birthday (excluding the year)
  if (month_difference < 0 || (month_difference === 0 && today_date.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

Person.prototype.setFriends = function(new_friends) {
  this.friend_list = new_friends;
}

Person.prototype.addFriend = function(new_friend)  {
  this.friend_list.push(new_friend);
}

Person.prototype.removeFriend = function(bad_friend) {
  var tempFriendList = [];
  for (i=0; i < this.friend_list.length; i++) {
    if (! (this.friend_list[i] === bad_friend) ) {
      tempFriendList.push(this.friend_list[i]);
    }
  }
  this.setFriends(tempFriendList);
}

Person.prototype.greet = function() {
  console.log("Hello, I\'m " + this.name + ". Nice to meet you!");
}

console.log("\n\n\nEXERCISE 2.1\n");
//create some instances of Person
var Andrew = new Person("Andrew Fulling", "07/12/1996");
Andrew.greet();
var Judy = new Person("Judy Kwon", "10/24/1996");
Judy.greet();
var Alexander = new Person("Iscandar the Conqueror", "04/25/1050")
Alexander.greet();
var Arturia = new Person("Arturia Pendragon", "08/18/1248");
Arturia.greet();
var Gilgamesh = new Person("Gilgamesh King of Heroes", "02/03/0104");
Gilgamesh.greet();

//assign friendships
Andrew.setFriends([Judy, Arturia]);
Judy.setFriends([Alexander]);
Alexander.setFriends([Judy, Arturia, Gilgamesh]);
Arturia.setFriends([Andrew, Alexander]);
Gilgamesh.setFriends([Alexander]);

//display friendships
console.log("Andrew\'s friends:");
for (i=0; i < Andrew.friend_list.length; i++) {console.log("\t" + Andrew.friend_list[i].name);}
console.log("Judy\'s friends:");
for (i=0; i < Judy.friend_list.length; i++) {console.log("\t" + Judy.friend_list[i].name);}
console.log("Alexander\'s friends:");
for (i=0; i < Alexander.friend_list.length; i++) {console.log("\t" + Alexander.friend_list[i].name);}
console.log("Arturia\'s friends:");
for (i=0; i < Arturia.friend_list.length; i++) {console.log("\t" + Arturia.friend_list[i].name);}
console.log("Gilgamesh\'s friends:");
for (i=0; i < Gilgamesh.friend_list.length; i++) {console.log("\t" + Gilgamesh.friend_list[i].name);}

//Create some relationship drama by adding and removing friends.
console.log("\nGilgamesh wants to be friends with Judy!");
Gilgamesh.addFriend(Judy);
console.log("Gilgamesh\'s friends:");[i]
for (i=0; i < Gilgamesh.friend_list.length; i++) {console.log("\t" + Gilgamesh.friend_list[i].name);}
console.log("Judy\'s friends:");
for (i=0; i < Judy.friend_list.length; i++) {console.log("\t" + Judy.friend_list[i].name);}

console.log("\nJudy accepts Gilgamesh\'s friendship!");
Judy.addFriend(Gilgamesh);
console.log("Judy\'s friends:");
for (i=0; i < Judy.friend_list.length; i++) {console.log("\t" + Judy.friend_list[i].name);}

console.log("\nAndrew tries to become friends with Gilgamesh.");
Andrew.addFriend(Gilgamesh);
console.log("Andrew\'s friends:");
for (i=0; i < Andrew.friend_list.length; i++) {console.log("\t" + Andrew.friend_list[i].name);}
console.log("Gilgamesh\'s friends:");
for (i=0; i < Gilgamesh.friend_list.length; i++) {console.log("\t" + Gilgamesh.friend_list[i].name);}

console.log("\nBut Gilgamesh refused Andrew\'s offer, so Gilgamesh is no longer Andrew\'s friend.");
Andrew.removeFriend(Gilgamesh);
console.log("Andrew\'s friends:");
for (i=0; i < Andrew.friend_list.length; i++) {console.log("\t" + Andrew.friend_list[i].name);}

//compare ages.
console.log("\nAndrew thinks he is at least a year older than Judy. Is he right?");
console.log("\tAndrew\'s age: " + Andrew.getAge());
console.log("\tJudy\'s age: " + Judy.getAge());
if (Andrew.getAge() > Judy.getAge()) {
  console.log("Andrew is older than Judy. Andrew is right!");
} else {
  console.log("Andrew is wrong! Judy is either the same age or older than Andrew.");
}

console.log("\nProud Gilgamesh thinks he is older than Arturia. Is Gilgamesh right?");
console.log("Gilgamesh\'s age: " + Gilgamesh.getAge());
console.log("Arturia\'s age: " + Arturia.getAge());
if (Gilgamesh.getAge() > Arturia.getAge()) {
  console.log("Gilgamesh is older than Arturia. Proud Gilgamesh is right!");
} else {
  console.log("Arturia is either older than or the same age as Gilgamesh. Gilgamesh should learn humility.");
}



console.log("\n\n\nEXERCISE 2.2");
//Exercise 2.2: Inheritance and Polymorphism
function Student(name, birthdate, area_of_study) {
  Person.call(this, name, birthdate);
  this.area_of_study = area_of_study;
}

Student.prototype = Object.create(Person.prototype);
Student.prototype.greet = function() {
  console.log("Hello! I\'m " + this.name + ", and I study " + this.area_of_study + ". Nice to meet you!");
}

//update Andrew and Judy to be Students
Andrew = new Student(Andrew.name, Andrew.birthdate, "Strategic Communication and Computer Science");
Judy = new Student(Judy.name, Judy.birthdate, "Computer Science");
Andrew.setFriends([Judy, Arturia]);
Judy.setFriends([Alexander, Gilgamesh]);

//check polymorphic greet() method
Andrew.greet();
Judy.greet();
Alexander.greet();
Arturia.greet();
Gilgamesh.greet();

//inheritance tests
console.assert(Andrew instanceof Student);
console.assert(Judy instanceof Student);
console.assert(Andrew instanceof Person);
console.assert(Judy instanceof Person);
console.assert(Alexander instanceof Person);
console.assert(! (Alexander instanceof Student));
console.assert(Arturia instanceof Person);
console.assert(! (Arturia instanceof Student));
console.assert(Gilgamesh instanceof Person);
console.assert(! (Gilgamesh instanceof Student));

console.log("\nAll inheritance tests passed!");
