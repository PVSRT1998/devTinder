# Dev Tinder APIs

## authRouter
    - POST /signup
    - POST /login
    - POST /logout

## profileRouter
    - GET /profile/view
    - PATCH /profile/edit
    - PATCH /profile/password

## connectionRequestRouter
    - POST /request/send/intereste/:userId
    - POST /request/send/ignored/:userId
    - POST /request/review/accepted/:requestId
    - POST /request/review/rejected/:requestId

## userRouter
    - GET /user/connection
    - GET /user/requests/received
    - GET /user/feed - Gets you the profiles of other users on platform




 ### Status: igone, interested, accepted, rejected



 ## Pagination

 - .skip()
 - .limit()