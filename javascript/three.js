"use strict"
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")

canvas.height = window.innerHeight
canvas.width = window.innerWidth

var stars = []
var bgStars = []

class BackgroundStars {
    constructor(size = Math.random() + 0.5) {
        this.size = size
        this.relativeSpeed = 1
        this.color = GenerateStarColour()
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.angle = Math.atan2(this.y - canvas.height / 2, this.x - canvas.width / 2)

        this.travaled = 1

        this.direction = {
            x: Math.cos(this.angle) * this.relativeSpeed,
            y: Math.sin(this.angle) * this.relativeSpeed
        }
        this.direction.x = Number(this.direction.x)

        this.maxGlow = Number((Math.random() * 4 + 2).toFixed(2))
        this.glowTo = 0.5
        this.glow = 1.5
    }
    draw(delta) {
        var size = this.size + this.travaled / (canvas.width * 2)
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2)
        ctx.fill()

        //This isn't accurate but to prevent huge stars. If delta > glowTo-glow then we generate a new glow to.
        //The glow controller is a bit messy, and has glitches when the fps isn't solid(5-10fps).
        this.glow += this.glowTo * delta

        if (this.maxGlow <= this.glow) {
            this.glowTo = -this.maxGlow
            this.glow = this.maxGlow
        } else if (this.glow <= 1) {
            this.glowTo = this.maxGlow - this.glow
            //Low fps issue when delta is >~ 0.4
            if (this.glow < 0) this.glow = 0
        }
        // Create gradient
        var grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, size * this.glow)
        grd.addColorStop(0, this.color)
        grd.addColorStop(1, "rgba(255,255,255,0)")

        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.arc(this.x, this.y, size * this.glow, 0, Math.PI * 2)
        ctx.fill()

    }
    update(pos, delta) {
        this.relativeSpeed += this.travaled / (canvas.width ** 2)

        this.direction.x = Math.cos(this.angle) * this.relativeSpeed
        this.direction.y = Math.sin(this.angle) * this.relativeSpeed

        this.travaled += Math.hypot(this.direction.x * delta, this.direction.y * delta)

        this.x += this.direction.x * delta
        this.y += this.direction.y * delta
        if (this.x < -100 || this.x > canvas.width + 100 || this.y < -100 || this.y > canvas.height + 100) {
            bgStars.splice(pos, 1)
        } else {
            this.draw(delta)
        }
    }
}

class Star {
    constructor() {
        this.size = Math.random() + 1
        this.stretch = 0
        this.relativeSpeed = 20
        this.setSpeed = 20
        this.color = GenerateStarColour()

        //need to assume middle of canvas is 0, 0
        this.x = (Math.random() - 0.5) * 80
        this.y = (Math.random() - 0.5) * 80

        this.angle = Math.atan2(this.y, this.x)

        this.travaled = Math.hypot(this.x, this.y)

        this.x += canvas.width / 2
        this.y += canvas.height / 2

        this.direction = {
            x: Math.cos(this.angle) * this.relativeSpeed,
            y: Math.sin(this.angle) * this.relativeSpeed,
        }
    }
    draw(delta) {
        if (canvas.width / 8 > this.travaled) {
            ctx.fillStyle = this.color
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.size + this.travaled / (canvas.width / 5), 0, Math.PI * 2)
            ctx.fill()
        } else {
            ctx.lineWidth = this.size * 2 + 0.625
            ctx.strokeStyle = this.color

            ctx.beginPath()
            ctx.moveTo(this.x - this.direction.x * delta * 1.5, this.y - this.direction.y * delta)
            ctx.lineTo(this.x, this.y)
            ctx.stroke()
        }
    }
    update(pos, delta) {
        this.relativeSpeed += this.travaled ** 2 / (canvas.width / 6)

        this.direction.x = Math.cos(this.angle) * this.relativeSpeed
        this.direction.y = Math.sin(this.angle) * this.relativeSpeed

        this.x += this.direction.x * delta
        this.y += this.direction.y * delta
        this.travaled += Math.hypot(this.direction.x * delta, this.direction.y * delta)

        if (this.x < -100 || this.x > canvas.width + 100 || this.y < -100 || this.y > canvas.height + 100) {
            stars.splice(pos, 1)
        } else {
            this.draw(delta)
        }
    }
}

function GenerateStarColour() {
    //hsl range 0-60 (red) 180-240 (blue)
    return `hsl(${Math.random() * 60 + (Math.round(Math.random() + 0.3) ? 0 : 180)}, 100%, ${Math.floor(Math.random() * 20) + 81}%)`
}

for (var c = 0; c < 200; c++) {
    bgStars.push(new BackgroundStars())
}
for (var c = 0; c < 10; c++) {
    stars.push(new Star())
}

setInterval(() => {
    if (!paused) {
        stars.push(new Star())
    }
}, 15)

setInterval(() => {
    if (!paused) {
        bgStars.push(new BackgroundStars())
    }
}, 250)

var delta = 0, lastchecked = Date.now(), paused = false, pauseTime
AnimationLoop()

function AnimationLoop() {
    delta = (Date.now() - lastchecked) / 1000
    lastchecked = Date.now()
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    bgStars.forEach((bgstar, pos) => {
        bgstar.update(pos, delta)
    })

    stars.forEach((star, pos) => {
        //delta = fraction of a second, because speed is calculated per second.
        star.update(pos, delta)
    })
    requestAnimationFrame(AnimationLoop)
}

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState == "visible") {
        paused = false
        lastchecked += (Date.now() - pauseTime)
        //Pretend like no time passed during the pause ^
    } else {
        paused = true
        pauseTime = Date.now()
    }
})
