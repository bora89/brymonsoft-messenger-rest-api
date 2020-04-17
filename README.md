## How to run

Make sure you have Docker [installed](https://www.docker.com/)

1) `git clone https://github.com/KirillGalimov/brymonsoft-messenger-rest-api.git`
2) `docker-compose build`
3) `docker-compose up`

Runs the app in the development mode

## URL
LOCAL_URL: http://localhost:5000/<br />
DEPLOY_URL: https://brymonsoft-messenger-rest-api.herokuapp.com/

## API Methods

### Login
**POST** `/api/login`
```
body {
  login: String, required,
  password: String, required
}
```
Authorizes the user. Use this before you reach other endpoints to get the authorization token.<br /><br />
**Credentials:**<br />
login: `admin`<br />
password: `admin`

### Headers
Every endpoint below needs to be reached with 'Authorization' header and 'Bearer ' + token as the value<br /><br />
Example:<br/>
`Authorization:` `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFkbWluIiwiaWF0IjoxNTg3MTE5NjQ0LCJleHAiOjE1ODcxMjMyNDR9.usuetNIQyXIGbOyMvoSfEnYc2YrfCjiSPvtx8uxUcgQ`

### GET USERS LIST
**GET** `/api/users`<br /><br />
query params:
```
name: String
mobile: String
```
Example: `/api/users/?name=Brad%20Delson&mobile=%2B77014548866`<br />
Responds with user list (filtered according to query params). Make sure to use encodeURIcomponent

### CREATE USER
**POST** `/api/users`<br />
```
body {
  name: String, required,
  imageUrl: String, required,
  mobile:, String, required, min: 8
}
```
Creates a new user, and responds with id. You can send a message to created users via mentioned id.

### SEND MESSAGE
**POST** `/api/messages`<br />
```
body {
  text: String, required,
  date: Date, required,
  recipientId: String, required
}
```
Creates a new message and sends it to user with id provided in recipientId field

### GET DIALOGS LIST
**GET** `/api/messages`<br /><br />
Responds with list of dialogs
