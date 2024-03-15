export interface BallProps {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
  color: string
  id: number
  ctx: CanvasRenderingContext2D
}

export class Ball implements BallProps{
  x: number
  y: number
  dx: number
  dy: number
  radius: number
  color: string
  id: number
  ctx: CanvasRenderingContext2D
  timeout: boolean

  get speed() {
    return Math.sqrt(this.dx * this.dx + this.dy * this.dy)
  }

  constructor({ x, y, dx, dy, radius, color, ctx, id }: BallProps) {
    this.x = x
    this.y = y
    this.dx = dx
    this.dy = dy
    this.radius = radius
    this.color = color
    this.ctx = ctx
    this.id = id
    this.timeout = false
  }

  draw(height: number, width: number, otherBalls: Ball[]) {
    if (this.y + this.dy + this.radius > height || this.y + this.dy - this.radius < 0) {
      this.dy = -this.dy
    }
    if (this.x + this.dx + this.radius > width || this.x + this.dx - this.radius < 0) {
      this.dx = -this.dx
    }

    if (!this.timeout) {

      otherBalls.forEach(ball => {
        if (Math.floor(Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2))) <= ball.radius + this.radius) {
          ball.timeout = true
          setTimeout(() => ball.timeout = false, 100)
          const angle = Math.atan((this.x - ball.x) / (this.y - ball.y)) + Math.PI
          const speed = this.speed / 2
          const ballDy = speed * Math.cos(angle)
          const ballDx = Math.sqrt(speed * speed - ballDy * ballDy)
          ball.dx = ballDx
          ball.dy = ballDy
          ball.y += 2*ballDy
          ball.x += 2*ballDx
          const dy = speed * Math.cos(angle - Math.PI / 2)
          const dx = Math.sqrt(speed * speed - dy * dy)
          this.dx = dx
          this.dy = dy
          this.x += 2*dx
          this.y += 2*dy

        }
      })
    }

    if (this.dy > 0) {
      this.dy -= 0.005
    } else if (this.dy < 0) {
      this.dy += 0.005
    }

    if (this.dx > 0) {
      this.dx -= 0.005
    } else if (this.dx < 0) {
      this.dx += 0.005
    }

    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
  }
}