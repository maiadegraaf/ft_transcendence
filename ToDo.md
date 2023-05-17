# To Do List

## Chat

* [x] testing endpoints for user, admin, banned and muted in groupProfile

[//]: # (* [ ] accessibility for groupProfile by admin owner and user &#40;frontend&#41;)
* [x] accessibility for groupProfile by admin owner and user (backend)
* [x] adding logic to admin, muted and banned in groupProfile
* [x] adding time for muted user
* [x] owner of group can add or delete admin
* [x] admin can kick ban or mute users
* [ ] search list for groupProfile
* [x] leave group
* [x] pass the owner role to next admin or user
* [x] frontend for admin page and user page for groupProfile
* [x] setting up channels for public, private or protected
* [x] sending invite for channels
* [x] searching for new public channels
* [x] setting up password for protected channels
* [ ] time and sender for messages
* [ ] invite other players for a pong match
* [x] access user profile from chat or profile
* [x] frontend for message list
* [x] frontend for channel list
* [x] frontend for input for new channels
* [ ] make frontend pretty for everything
* [ ] return values for all endpoints
* [ ] add error handling for all endpoints

## Chat Bugs
* [ ] user added to group that is not connected to the 
server gives a double join room and error on the backend
* [ ] change the correct view of the channel when new channel is made for the user
* [ ] if you are in group settings, and you want to access a different
group setting then the old group setting is still active
* [ ] userById not safe
* [ ] socket with emitGroupChannelToUser is not found