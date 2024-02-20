# Client community portal
[Go to website]
## _Description_

The Client Community Portal is a platform designed for clients of a specific organization to provide feedback, share feature requests, and engage with one another. Clients can post their opinions, which can be viewed, upvoted, and commented on by others with similar interests. Posts are sorted by the number of upvotes, facilitating easy identification of popular opinions. This portal enables the organization to gather valuable insights and prioritize enhancements based on client preferences.

## _Installation_
clone the project using
```
git clone https://github.com/MadhuVembadi/client-community-portal.git

```
Install the required dependencies
```
npm install
```
Create a .env file with following variables
```
PORT=
DBURL=
SECRET_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_REGION=
S3_BUCKET=
MAILPASS=
MAILID=
hashedPassword=
```

Build the app using 
```
npm run build
```

Start the app using
```
node server.js
```
The app will start running on the port number you have specified in the .env file

## _Features_

- Upvotes
- Comment Interactions
- Sort by Upvotes
- Email Notifications
- Easy User Search
- Update Password
- Update Email
- Account Recovery

## Tech
- [ReactJS]
- [Bootstrap]
- [Node.js]
- [Express]
- [MongoDB]
- [JQuery]

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [Node.js]: <http://nodejs.org>
   [Bootstrap]: <https://getbootstrap.com/>
   [jQuery]: <http://jquery.com>
   [express]: <http://expressjs.com>
   [ReactJS]: <https://react.dev/>
   [MongoDB]: <https://www.mongodb.com/>
   [Go to website]: <https://client-community-portal.onrender.com/>

   >
