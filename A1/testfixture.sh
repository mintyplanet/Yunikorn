#!/bin/sh

SERVER=http://localhost:8000

# Post a bunch of topics
curl ${SERVER}/topic -d "title=Look at all these cats&link=www.nyancat.com"
curl ${SERVER}/topic -d "title=I like this website&link=www.nyancat.com"
curl ${SERVER}/topic -d "title=Nyan nyan nyan nyan&link=www.nyancat.com"
curl ${SERVER}/topic -d "title=This is worth looking at&link=www.nyancat.com"
curl ${SERVER}/topic -d "title=You should all see this&link=www.nyancat.com"
curl ${SERVER}/topic -d "title=Put this in your favourites&link=www.nyancat.com"

# Reply to some of the topics
curl ${SERVER}/topic/19xtf1ts/comment -d "body=Fantastic!"
curl ${SERVER}/topic/19xtf1ts/comment -d "body=Splendid!"
curl ${SERVER}/topic/19xtf1ts/comment -d "body=Brilliant!"
curl ${SERVER}/topic/19xtf1tt/comment -d "body=Fabulous!"
curl ${SERVER}/topic/19xtf1tt/comment -d "body=Beautiful!"
curl ${SERVER}/topic/19xtf1tu/comment -d "body=Respost!"
curl ${SERVER}/topic/19xtf1tv/comment -d "body=nyan nyan nyan!"
curl ${SERVER}/topic/19xtf1tv/comment -d "body=...."

# Reply to some of the comments
curl ${SERVER}/topic/19xtf1ts/comment/19xtf1ty -d "body=I am Karin"
curl ${SERVER}/topic/19xtf1ts/comment/19xtf1ty -d "body=I am Kevin"
curl ${SERVER}/topic/19xtf1ts/comment/19xtf1ty -d "body=I am Yuki"
curl ${SERVER}/topic/19xtf1ts/comment/19xtf1ty -d "body=I am Naomi"
curl ${SERVER}/topic/19xtf1ts/comment/19xtf1ty -d "body=We are Yunikorn"

curl ${SERVER}/topic/19xtf1ts/comment/19xtf1ty -d "body=Agree"
curl ${SERVER}/topic/19xtf1ts/comment/19xtf1ty -d "body=Disagree"
curl ${SERVER}/topic/19xtf1ts/comment/19xtf1ty -d "body=BOOOOOO"
curl ${SERVER}/topic/19xtf1ts/comment/19xtf1ty -d "body=Wheeeeee"
curl ${SERVER}/topic/19xtf1ts/comment/19xtf1ty -d "body=Lalalalala"

#Upvote some comments
curl ${SERVER}/topic/19xtf1ts/comment/19xtf1ua -X PUT
curl ${SERVER}/topic/19xtf1ts/comment/19xtf1ua -X PUT
curl ${SERVER}/topic/19xtf1ts/comment/19xtf1ua -X PUT
curl ${SERVER}/topic/19xtf1ts/comment/19xtf1ua -X PUT

curl ${SERVER}/topic/19xtf1tu/comment/19xtf1u3 -X PUT
curl ${SERVER}/topic/19xtf1tu/comment/19xtf1u3 -X PUT
curl ${SERVER}/topic/19xtf1tu/comment/19xtf1u3 -X PUT
curl ${SERVER}/topic/19xtf1tu/comment/19xtf1u3 -X PUT
curl ${SERVER}/topic/19xtf1tu/comment/19xtf1u3 -X PUT
curl ${SERVER}/topic/19xtf1tu/comment/19xtf1u3 -X PUT
curl ${SERVER}/topic/19xtf1tu/comment/19xtf1u3 -X PUT
