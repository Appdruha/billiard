export interface BallProps {
  x: number
  y: number
  radius: number
  color: string
  id: number
  ctx: CanvasRenderingContext2D
}

export class Ball implements BallProps {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  id: number
  ctx: CanvasRenderingContext2D

  constructor({ x, y, radius, color, ctx, id }: BallProps) {
    this.x = x
    this.y = y
    this.vx = 0
    this.vy = 0
    this.radius = radius
    this.color = color
    this.ctx = ctx
    this.id = id
  }

  rotate(x: number, y: number, sin: number, cos: number, reverse: boolean) {
    return {
      x: (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
      y: (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
    };
  }

  draw(height: number, width: number, otherBalls: Ball[]) {
    if (this.y + this.vy + this.radius > height || this.y + this.vy - this.radius < 0) {
      this.vy = -this.vy
    }
    if (this.x + this.vx + this.radius > width || this.x + this.vx - this.radius < 0) {
      this.vx = -this.vx
    }

    otherBalls.forEach(ball => {
      const dx = ball.x - this.x,
        dy = ball.y - this.y,
        dist = Math.sqrt(dx * dx + dy * dy)
      //вычисляем коллизии
      if (dist < this.radius + ball.radius) {
        const angle = Math.atan2(dy, dx)
        const sin = Math.sin(angle)
        const cos = Math.cos(angle)
        const pos0 = { x: 0, y: 0 }
        const pos1 = this.rotate(dx, dy, sin, cos, true)
        const vel0 = this.rotate(this.vx, this.vy, sin, cos, true)
        const vel1 = this.rotate(ball.vx, ball.vy, sin, cos, true)
        //реагируем на коллизию
        const vxTotal = vel0.x - vel1.x
        vel0.x = vel1.x
        vel1.x = vxTotal + vel0.x
        //обновляем позиции чтобы шары не застряли друг в друге
        const absV = Math.abs(vel0.x) + Math.abs(vel1.x)
        const overlap = (this.radius + ball.radius) - Math.abs(pos0.x - pos1.x)
        pos0.x += vel0.x / absV * overlap
        pos1.x += vel1.x / absV * overlap
        //возвращаем позиции
        const pos0F = this.rotate(pos0.x, pos0.y, sin, cos, false)
        const pos1F = this.rotate(pos1.x, pos1.y, sin, cos, false)

        ball.x = this.x + pos1F.x
        ball.y = this.y + pos1F.y
        this.x = this.x + pos0F.x
        this.y = this.y + pos0F.y
        //возвращаем скорости
        const vel0F = this.rotate(vel0.x, vel0.y, sin, cos, false),
          vel1F = this.rotate(vel1.x, vel1.y, sin, cos, false)
        this.vx = vel0F.x
        this.vy = vel0F.y
        ball.vx = vel1F.x
        ball.vy = vel1F.y
      }
    })

    if (this.vy > 0) {
      this.vy -= 0.005
    } else if (this.vy < 0) {
      this.vy += 0.005
    }

    if (this.vx > 0) {
      this.vx -= 0.005
    } else if (this.vx < 0) {
      this.vx += 0.005
    }

    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true)
    this.ctx.closePath()
    this.ctx.fillStyle = this.color
    this.ctx.fill()
  }
}