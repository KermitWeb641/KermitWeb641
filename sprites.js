const SPRITE_SIZE = 32;

const PLAYER_SPRITES = {
    idle: {
        frames: 4,
        animationSpeed: 8,
        spriteSheet: 'player_idle.png'
    },
    walk: {
        frames: 6,
        animationSpeed: 10,
        spriteSheet: 'player_walk.png'
    },
    attack: {
        frames: 4,
        animationSpeed: 12,
        spriteSheet: 'player_attack.png'
    }
};

class Character {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.currentState = 'idle';
        this.frameIndex = 0;
        this.frameCounter = 0;
        this.direction = 1; // 1 for right, -1 for left
        this.loadSprites();
    }

    loadSprites() {
        this.sprites = {};
        Object.keys(PLAYER_SPRITES).forEach(state => {
            const img = new Image();
            img.src = `sprites/${PLAYER_SPRITES[state].spriteSheet}`;
            this.sprites[state] = img;
        });
    }

    update() {
        // Animation update
        this.frameCounter++;
        const currentAnim = PLAYER_SPRITES[this.currentState];
        if (this.frameCounter >= currentAnim.animationSpeed) {
            this.frameCounter = 0;
            this.frameIndex = (this.frameIndex + 1) % currentAnim.frames;
        }

        // Movement update
        const keys = {};
        if (keys['w'] || keys['a'] || keys['s'] || keys['d']) {
            this.currentState = 'walk';
        } else {
            this.currentState = 'idle';
        }
    }

    draw(ctx, cameraX, cameraY) {
        const screenX = this.x - cameraX;
        const screenY = this.y - cameraY;
        
        ctx.save();
        if (this.direction === -1) {
            ctx.scale(-1, 1);
        }
        
        ctx.drawImage(
            this.sprites[this.currentState],
            this.frameIndex * SPRITE_SIZE,
            0,
            SPRITE_SIZE,
            SPRITE_SIZE,
            screenX,
            screenY,
            SPRITE_SIZE,
            SPRITE_SIZE
        );
        
        ctx.restore();
    }
}
