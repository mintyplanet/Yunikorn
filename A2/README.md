Trends in Tumblr
===================
Trends in Tumblr is a nodeJS server which tracks popular posts in Tumblr.
It is capable of the following:

* Add a new blog to track (identified by its {base-hostname})
* For every blog being tracked, retrieve a list of all posts liked by the tumblr user
* For every post liked, retrieve its URL, DATE, an IMAGE or a TEXT to describe it, and the NOTE_COUNT (which determines its popularity across Tumblr)
* Repeat every hour, tracking the changes to the popularity of every post tracked
* Upon request, provide a list of the TOP trending posts as measured by their popularity by the hour

Members:
----------
* Karin Ng
* Kevin Yuen
* Naomi Cui
* Yuki Saito

API Documentation:
--------------------
<table border=1>
<tr>
  <th>Method</th><th>url</th><th>parameters</th><th>Response</th>
</tr>
<tr>
  <td>POST</td><td>/blog</td><td><ul><li>blog: a string indicating a new blog to track by its {base-hostname}</li></ul></td><td>HTTP status 200 if accepted</td>
</tr>
<tr>
  <td>GET</td><td>blogs/trends</td><td>
  <ul>
  <li>limit: the maximum number of results to return (optional)</li>
  <li>order: a string "Trending" or "Recent" to determine which posts should be included in the response.</li>
  </ul>
  "Trending" should return those posts that have the largest increments in note_count in the last hour, 
  while "Recent" should return the most recent posts regardless of their popularity.
  </td><td>a list of the TOP trending posts as measured by their popularity as a JSON response</td>
</tr>
<tr>
  <td>GET</td><td>blog/{base-hostname}/trends</td><td>Same as above</td><td>Same as above</td>
</tr>
</table> 


Installation:
---------------
We assume that you have nodeJS installed, and npm is in your path.  
Run `npm install` in this directory to install dependencies(express, sqlite3).

How to run:
-------------------
Run `node server.js`  
It will print the address and port that the server is listening to. (Default 127.0.0.1:31335)  
Direct your frontend web application to this address.  
Alternatively, use 
