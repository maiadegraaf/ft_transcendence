# How to join a match from the Chat

## A Brief Tutorial by Yours Truly, Maia

### Step 1: Connect the Socket

When a user wants to join a match, bind the socket to the user by emiting from the socket:

```typescript
this.socket.emit('bind', this.userId)
```

if the user is already in a match the server will emit an error message so the front end needs to listen to that error message and display it to the user. This is how you can catch it. I also bound it to the errorPopUp, but up to you how you want to deal with it.

```typescript
this.socket.on('MultipleConnections', (msg: string) => {
    this.$refs.errorPopUp.show('You are already ' + msg)
    this.reset()
})
```

### Step 2: Join the Match

When both users have been bound to their sockets emit `createMatch`

```typescript
this.socket.emit('createMatch', {
    player1: this.player1Id,
    player2: this.player2Id
})
```

The socket will then emit `opponentFound` to both sockets with the matchId. The front end needs to listen for this and then redirect the user to the match page. This is how you can catch it:

```typescript
this.socket.on('opponentFound', (matchId: number) => {
    console.log('Opponent found')
    this.matchid = matchId
})
```

### Step 3: Redirect to the Match Page

I've altered the PongGame view to accept parameters now from the router, so now you can just send the userId, Socket, and MatchID to the page, and it should load the match (fingers crossed). This is how you can do that:

```typescript
this.$router.push({
    name: 'Pong',
    params: {
        userId: this.userId,
        socket: this.socket,
        matchId: this.matchid
    }
})
```

### Step 4: Play Pong

##### Hope it works!!!!!
