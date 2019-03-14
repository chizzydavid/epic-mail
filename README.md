# EPIC MAIL

[![Build Status](https://travis-ci.org/chizzydavid/epic-mail.svg?branch=develop)](https://travis-ci.org/chizzydavid/epic-mail)
[![Coverage Status](https://coveralls.io/repos/github/chizzydavid/epic-mail/badge.svg?branch=api-fix)](https://coveralls.io/github/chizzydavid/epic-mail?branch=api-fix)
[![Maintainability](https://api.codeclimate.com/v1/badges/edea618274a9d1503548/maintainability)](https://codeclimate.com/github/chizzydavid/epic-mail/maintainability)

### Project Overview
Epic Mail is a web application designed to make sending and receiving email messages much more efficient and convenient.
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
You can find the documentation for the Epic Mail API [here](http://chizzy-epicmail.herokuapp.com/api/v1/api-docs)


### Pivotal Tracker
Pivotal Tracker was the project management tool used in building this project. You can view this project on PT [here](https://www.pivotaltracker.com/n/projects/2314472)

### API Endpoints
**You can access all endpoints on [Heroku](http://chizzy-epicmail.herokuapp.com/api/v1/api-docs)**

| HTTP METHOD        | API ENDPOINT   | DESCRIPTION  |
| ------------- |:-------------:|:-----:|
| POST      | *api/v1/auth/signup* | Creates Account |
| POST      | *api/v1/auth/login* | User Login |
| GET      | *api/v1/users* | Gets all users |
| GET      | *api/v1/users/:id* | Gets a Single user |
| PUT     | *api/v1/users/:id* | Edits a User |
| DELETE    | *api/v1/users/:id* | Deletes a user |
| POST      | *api/v1/messages* | Sends a Message|
| GET      | *api/v1/messages* | Gets all received messages |
| GET      | *api/v1/messages/:id* | Gets a single message |
| GET      | *api/v1/messages/unread* | Gets all unread messages |
| GET      | *api/v1/messages/sent* | Gets all sent messages |
| DELETE   | *api/v1/messages/:id* | Deletes a message |


### Author 
***Chizindu David***