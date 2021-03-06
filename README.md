# MAIL HIVE

### Project Overview
Mail Hive is a web application designed to make sending and receiving email messages much more efficient and convenient.
The application allows its users to both send and receive mails from individuals. Users can create groups and send messages to all members of the group. Messages can be replied to instantly and when needed a thread could be created.
Users can also upload a picture of their choice for their profile.

### Features
* Users can send and receive email messages from individuals
* Users can view all his received messages.
* Users can view all unread messages
* Users can save a message as a draft and come back later to it.
* Users can create groups 
* Users can add members to a group they own
* Users can delete members from a group they own.
* Users can send a message to any group.
* Users can retract sent messages

### Optional Featues
* Users can upload a profile photo if he chooses
* User can reset password
* User can send messages via SMS using Twillio


### Project UI
[View Project Template](https://chizzydavid.github.io/epic-mail/UI/)


### Project Documentation
You can find the documentation for the Mail Hive API [here](http://chizzy-epicmail.herokuapp.com/api-docs)


### Pivotal Tracker
Pivotal Tracker was the project management tool used in building this project. You can view this project on PT [here](https://www.pivotaltracker.com/n/projects/2314472)

### API Endpoints
**You can access all endpoints on [Heroku](http://chizzy-epicmail.herokuapp.com/api/v2/)**

| HTTP METHOD        | API ENDPOINT   | DESCRIPTION  |
| ------------- |:-------------:|:-----:|
| POST      | *api/v2/auth/signup* | Creates Account |
| POST      | *api/v2/auth/login* | User Login |
| GET      | *api/v2/users* | Gets all users |
| GET      | *api/v2/users/:id* | Gets a Single user |
| PUT     | *api/v2/users/:id* | Edits a User |
| DELETE    | *api/v2/users/:id* | Deletes a user |
|                |              |              |
| POST      | *api/v2/messages* | Sends a Message|
| POST      | *api/v2/messages/draft* | Saves message as draft|
| GET      | *api/v2/messages* | Gets all received messages |
| GET      | *api/v2/messages/:id* | Gets a single message |
| PATCH      | *api/v2/messages/:id* | Updates message to read |
| GET      | *api/v2/messages/read* | Gets all read messages |
| GET      | *api/v2/messages/unread* | Gets all unread messages |
| GET      | *api/v2/messages/draft* | Gets all drafts |
| GET      | *api/v2/messages/sent* | Gets all sent messages |
| DELETE   | *api/v2/messages/retract/:id* | Retracts a message |
| DELETE   | *api/v2/messages/sent/:id* | Deletes a sent message |
| DELETE   | *api/v2/messages/:id* | Deletes a received message |
|                |              |              |
| POST     | *api/v2/groups* | Creates a Group|
| GET      | *api/v2/groups* | Gets all User Groups |
| GET      | *api/v2/groups/:groupId* | Gets a single group |
| PUT      | *api/v2/groups/:groupId* | Edits a single group |
| POST     | *api/v2/groups/:groupId/messages* | Send message to group |
| POST     | *api/v2/groups/:groupId/users* | Add user to a group |
| DELETE   | *api/v2/groups/:groupId/users/:id* | Delete user from group |
| DELETE   | *api/v2/groups/:groupId* | Deletes a group |

### Author 
***Chizindu David***