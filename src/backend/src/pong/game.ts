import { Direction, GameState } from './enums'
import { Ball } from './interfaces/ball.interface'
import { Player } from './interfaces/player.interface'

export class GameTools {
    private readonly _height = 500
    private readonly _width = 800
    private readonly _maxY = this._height - 15
    private readonly _minY = 10
    private readonly _paddleW = 20
    private _paddleH = 100
    private _volley = 0
    private _volleyCount = 0
    private _ballSpeed = 5
    private _ballRadius = 10
    private _ballEdges = {
        left: this._ballRadius,
        right: this.width - this._ballRadius,
        top: this._ballRadius,
        bottom: this.height - this._ballRadius
    }
    private _ball: Ball = {
        x: this.width / 2 - this.ballRadius,
        y: this.height / 2 - this.ballRadius,
        dx: Direction.Left,
        dy: Direction.Up
    }
    private _player1: Player = {
        user: null,
        x: 20,
        y: this.height / 2 - this.paddleH / 2,
        new_y: this.height / 2 - this.paddleH / 2,
        score: 0
    }
    private _player2: Player = {
        user: null,
        x: this.width - 20 - this.paddleW,
        y: this.height / 2 - this.paddleH / 2,
        new_y: this.height / 2 - this.paddleH / 2,
        score: 0
    }

    get volley(): number {
        return this._volley
    }

    set volley(value: number) {
        this._volley = value
    }

    get ballSpeed(): number {
        return this._ballSpeed
    }

    set ballSpeed(value: number) {
        this._ballSpeed = value
    }

    get ballRadius(): number {
        return this._ballRadius
    }

    get ballEdgeTop() {
        return this._ballEdges.top
    }

    get ballEdgeBottom() {
        return this._ballEdges.bottom
    }

    get ballEdgeLeft() {
        return this._ballEdges.left
    }

    get ballEdgeRight() {
        return this._ballEdges.right
    }

    set ballEdges(ball: Ball) {
        this._ballEdges = {
            left: ball.x + this._ballRadius,
            right: ball.x + this._ballRadius,
            top: ball.y + this._ballRadius,
            bottom: ball.y + this._ballRadius
        }
    }

    get ball(): Ball {
        return this._ball
    }

    get player1(): Player {
        return this._player1
    }

    get player2(): Player {
        return this._player2
    }

    set paddleH(value: number) {
        this._paddleH = value
    }

    get paddleH(): number {
        return this._paddleH
    }

    get paddleW(): number {
        return this._paddleW
    }

    get height(): number {
        return this._height
    }

    get width(): number {
        return this._width
    }

    get maxY(): number {
        return this._maxY
    }

    get minY(): number {
        return this._minY
    }

    checkOutOfBounds(player): typeof player {
        if (player.y > this._maxY - this._paddleH) {
            player.y = this._maxY - this._paddleH
            player.new_y = this._maxY - this._paddleH
        } else if (player.y < this._minY) {
            player.y = this._minY
            player.new_y = this._minY
        }
        return player
    }

    smoothMovement(player): typeof player {
        if (player.new_y < player.y) {
            player.y += -5
        } else {
            player.y += 5
        }
        player = this.checkOutOfBounds(player)
        return player
    }

    checkForCollision(player1, player2, ball) {
        this.ballEdges = ball
        if (
            this.ballEdgeLeft <= player1.x + this.paddleW &&
            this.ballEdgeLeft >= player1.x &&
            this.ballEdgeTop >= player1.y &&
            this.ballEdgeBottom <= player1.y + this._paddleH
        ) {
            ball.dx *= -1
            ball.x = player1.x + this.paddleW + this.ballRadius
            this.volley++
            this._volleyCount++
        } else if (
            this.ballEdgeRight >= player2.x &&
            this.ballEdgeRight <= player2.x + this.ballRadius &&
            this.ballEdgeTop >= player2.y &&
            this.ballEdgeBottom <= player2.y + this._paddleH
        ) {
            ball.dx *= -1
            ball.x = player2.x - this.ballRadius
            this.volley++
            this._volleyCount++
        }
    }

    resetBall(ball, dx, dy) {
        ball.x = this.width / 2
        ball.y = this.height / 2
        ball.dx = dx
        ball.dy = dy
        this.volley = 0
        this._volleyCount = 0
    }

    checkForScore(player1, player2, ball) {
        this.ballEdges = ball
        if (ball.x < 0) {
            player2.score++
            this.resetBall(ball, Direction.Left, Direction.Up)
        } else if (this.ballEdgeRight > this.width) {
            player1.score++
            this.resetBall(ball, Direction.Right, Direction.Down)
        }
    }

    moveBall(ball): typeof ball {
        ball.x += ball.dx * this.ballSpeed
        ball.y += ball.dy * this.ballSpeed
    }

    moveComputer(computer, ball, computerSpeed): typeof computer {
        computer.new_y = this.ball.y - this.paddleH / 2
        if (computer.y != computer.new_y) {
            if (computer.y > computer.new_y) {
                computer.y += -computerSpeed
            } else {
                computer.y += computerSpeed
            }
        }
        return this.checkOutOfBounds(computer)
    }

    gameLoop(player1, player2, ball, computer_speed) {
        this.moveBall(ball)

        if (computer_speed > 0 && ball.x >= this.width / 2) {
            player2 = this.moveComputer(player2, ball, computer_speed)
        }

        if (player1.y != player1.new_y) {
            player1 = this.smoothMovement(player1)
        }
        if (computer_speed == 0 && player2.y != player2.new_y) {
            player2 = this.smoothMovement(player2)
        }

        if (ball.y <= 0 || ball.y >= this.maxY - 10) {
            ball.dy *= -1
        }

        if (this._volleyCount > 0 && this._volleyCount == 3) {
            this.ballSpeed += 0.1
            this._volleyCount = 0
        }

        this.checkForCollision(player1, player2, ball)
        this.checkForScore(player1, player2, ball)
    }
}
