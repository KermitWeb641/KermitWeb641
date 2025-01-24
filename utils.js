export const utils = {
    // Distance between two points
    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },

    // Angle between two points in radians
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },

    // Random number between min and max
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Random integer between min and max
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Collision detection between circles
    circleCollision(x1, y1, r1, x2, y2, r2) {
        return this.distance(x1, y1, x2, y2) < r1 + r2;
    },

    // Clamp value between min and max
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    // Linear interpolation
    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    },

    // Generate a unique ID
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    // Check if point is in rectangle
    pointInRect(x, y, rect) {
        return x >= rect.x && 
               x <= rect.x + rect.width && 
               y >= rect.y && 
               y <= rect.y + rect.height;
    },

    // Vector operations
    vector: {
        add(v1, v2) {
            return { x: v1.x + v2.x, y: v1.y + v2.y };
        },
        subtract(v1, v2) {
            return { x: v1.x - v2.x, y: v1.y - v2.y };
        },
        multiply(v, scalar) {
            return { x: v.x * scalar, y: v.y * scalar };
        },
        normalize(v) {
            const mag = Math.sqrt(v.x * v.x + v.y * v.y);
            return mag ? { x: v.x / mag, y: v.y / mag } : { x: 0, y: 0 };
        }
    }
};
