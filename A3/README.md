FavBrowser
===================
FavBrowser is a client that displays archived favorite tweets in a modern fashion.


DESCRIPTION:
---------------
* The client will query a local favs.json file and read the archived tweet the user has stored and display the tweets in a fashion that is responsive and elegent.


FEATURES:
---------------
* Clicking on the tweet will trigger a popup that displays the tweet in greater detail.
* Clicking on the user name or profile picture will trigger a popup that displays information about the user.


DESIGN DECISIONS:
---------------
* The client displays <x> tweets per page, and pages can be navigated through the "next" and "previous" buttons
	- We decided against having page numbers as based on the function of the client, we found it to be unnecessary (there would be little need to get to a certain page to find a tweet because if the JSON is changed, the tweet position will also change)
* The "next" and "previous" buttons' locations depend on the size of the screen
	- If the screen is larger than 640px, the buttons appear on the sides of the screen
	- If the screen is smaller or equal to 640px, the buttons appear on the top of the screen (being on the sides would take up too much space to easily see the tweet information)


Members:
----------
* Karin Ng
* Kevin Yuen
* Naomi Cui
* Yuki Saito
