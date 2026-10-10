function intersectRect(r1, r2) {
    return !(r2[0] > r1[1] || r2[1] < r1[0] || r2[2] > r1[3] || r2[3] < r1[2]);
}

function setKey(key, state) {
    let k = this.keys;
    const speed = this.getSpeedValue() | 0;
    
    switch (key) {
        case 'p':
            if (state) {
                k.pDown = !k.pDown;
                if (k.aDown) this.vX = -speed;
                else if (k.dDown) this.vX = speed;
            }
            break;

        case ' ':
            if (state) this.do_dash();
            break;

        case 'w': case 'arrowup':
            k.wDown = state;
            break;

        case 'a': case 'arrowleft':
            if (state) {
                this.facing2 = -1;
            } else {
                if (this.air && k.pDown) this.vX = -speed;
                if (k.dDown) this.facing2 = 1;
            }
            k.aDown = state;
            break;

        case 'd': case 'arrowright':
            if (state) {
                this.facing2 = 1;
            } else {
                if (this.air && k.pDown) this.vX = speed;
                if (k.aDown) this.facing2 = -1;
            }
            k.dDown = state;
            break;

        case 's': case 'arrowdown':
            k.sDown = state;
            break;
    }
}

const GRAVITY_CONSTANT = 2;

function move() {
    let initX = this.x;
    let initY = this.y;

    let keys = {};
    let isPlayer = (this.ENTITY_TYPE == 1 || this.ENTITY_TYPE == 0);
    if (isPlayer) keys = this.keys;

    if (this.vY >= -8) {
        this.jumping = false;
        this.jump.lock = true;
    }

    //Y-VELOCITY 
    let maxfallvelocity = this.gravity;
    if (maxfallvelocity < 0) maxfallvelocity = 0;
    if (this.ENTITY_TYPE == 0 && keys.iDown && this.modifiers.heavy)
        maxfallvelocity = 20;

    if (this.vY < 2*maxfallvelocity)
        this.vY += 4;
    if (this.vY > 2*maxfallvelocity)
        this.vY = 2*maxfallvelocity;

    //air resistance
    if (Math.abs(this.vX) > 0)
        this.vX -= 0.2 * Math.sign(this.vX) * GRAVITY_CONSTANT;
    if (Math.abs(this.vX) < 0.2)
        this.vX = 0;

    //VELOCITY END
    let stealth = 0;
    if (isPlayer && keys.iDown && this.modifiers.ninjamode === 1)
        stealth = 1;

    let speed = (this.getSpeedValue() + stealth); //    / (tileEffect.speed);
    let power = speed; //(this.power.val);

    this.moveX(2 * this.k);
    if (this.k == 0) {
        if (!this.air && !this.grabbed) {
            //this.vX = 0;
        }
        if (isPlayer && !keys.pDown) {
            if (!this.dashing && Math.abs(this.vX) < speed) {
                //this.vX += -1 * keys.aDown * power;
                //this.vX += keys.dDown * power;
                if(keys.aDown || keys.dDown)
                    this.vX = (-1 * keys.aDown + keys.dDown) * power;

                if (Math.abs(this.vX) > speed) {
                    this.vX = Math.sign(this.vX) * speed;
                }
            }
        }
      
        //this.moveX(this.vX);  
    }

    if (this.ENTITY_TYPE == 0) {
        switch (this.MOVEMENT_TYPE) {
            case 0:
                if (this.keys.wDown)
                    this.do_jump();
                break;
            case 1:
                this.moveY(this.keys.sDown * speed);
                this.moveY(-this.keys.wDown * speed);
                break;
        }
    }

}

function physicsTick(getIndex, mapObj, clip = false) {
    let oX = this.x;
    let oY = this.y;
    
    //update friction from displacement
    if (!clip) {
        this.y += this.vY;
        frictionX(this, getIndex, mapObj);
        this.y = oY;
        this.x += this.vX;
        frictionY(this, getIndex, mapObj);
        this.x = oX;
    }

    this.moveX(this.vX);
    this.moveY(this.vY);

    this.force.x = 0;
    this.force.y = 0;

    this.lastmovementx = oX;
    this.lastmovementy = oY;

    if (Math.abs(this.x - oX) > 0.1 || Math.abs(this.y - oY) > 0.1) {
        this.lastmovement = Date.now();
        this.accessories.map(a => a.onmove(this.game, this));
    }
}

function tileCollision(obj, getIndex, mapObj, callback) {
    let map = mapObj.map;

    let sz = obj.sz.val;
    if (sz > 78) sz = 78;

    let c = getIndex(obj); //this gets all adjacent tiles to do collisions with]]
    for (let i = 0; i < c.length; i++) {
let tile = map[c[i]];
if (!tile || typeof tile.goThru !== "function") continue;
if (tile.goThru(obj)) continue;
        //[LEFT, RIGHT, TOP, BOTTOM]
        let intersects = intersectRect(obj.getBoundingBox(78), [tile.x, tile.x + 100, tile.y + tile.h, tile.y + 90]);
        if (intersects) {
            callback(tile);
        }
    }
}

function frictionX(obj, getIndex, mapObj) {
    
    let sz = obj.sz.val;
    if (sz > 78) sz = 78;

    tileCollision(obj, getIndex, mapObj, (tile) => {
        //friction
        let ogVX = obj.vX;
        let mu = 3;
        let a = obj.keys?.aDown;
        let d = obj.keys?.dDown;
        let p = obj.keys?.pDown;
        if (tile.type == 9 || tile.type == 10) mu = 0.05;

        if (!p && ((a && !d) || (d && !a))) mu = 0;
        if (obj.vY < 0) mu = 0;
        

        let friction = -mu * obj.mass * (GRAVITY_CONSTANT) * Math.sign(obj.vX);
        obj.vX += friction / obj.mass;

        if (Math.sign(ogVX) !== Math.sign(obj.vX))
            obj.vX = 0;
        //end friction
    });
}

function frictionY(obj, getIndex, mapObj) {
    if (obj.modifiers.sticker !== 1) return;

    let sz = obj.sz.val;
    if (sz > 78) sz = 78;

    tileCollision(obj, getIndex, mapObj, (tile) => {
        let ogVY = obj.vY;
        let mu = 20;
        let resist = 0;
        let a = obj.keys?.aDown;
        let d = obj.keys?.dDown;
        let w = obj.keys?.wDown;
        let s = obj.keys?.sDown;

        if (!a && !d) mu = 0;
        if (w || s) mu = 0;

        obj.extrajump.val = obj.getExtrajumpsValue();
        obj.air = false;

        let friction = -mu * obj.mass * (GRAVITY_CONSTANT) * Math.sign(obj.vY);
        obj.vY += friction / obj.mass;
        if (Math.sign(ogVY) !== Math.sign(obj.vY))
            obj.vY = 0;
    });
}


//displacement
function moveX(amount, getIndex, mapObj, override) {
    
    if (this.movementLock && !override) return;
    if (amount == 0) return; //if move by 0 just return
    if (Math.abs(amount) > 60) {
        moveX.bind(this)(amount / 2, getIndex, mapObj, override);
        moveX.bind(this)(amount / 2, getIndex, mapObj, override);
        return;
    }
    if (this.clip) {
        this.moveXclip(amount);
        return;
    }

    //liquid physics
    let map = mapObj.map;
    let currentTile = map[Math.floor(this.x / 100) +  Math.floor(this.y / 90) * mapObj.width];
    if (currentTile?.liquid && !this.modifiers?.swim) {
        amount /= 2;
    }

    //border
    if (this.x < 0 && Math.sign(amount) == -1) return;
    if ((this.x > mapObj.width * 100) && Math.sign(amount) == 1) return;

   
    //move the object then check for collisions
    this.x += amount; //sign: 1 = right : -1 = left

    let sz = this.sz.val;
    if (sz > 78) sz = 78;

    tileCollision(this, getIndex, mapObj, (tile) => {
        //this.vX = 0;
        if (Math.sign(amount) == -1) {//moving left
            this.x = tile.x + 100 + sz / 2 + 1;
        } else {//right
            this.x = tile.x - sz / 2 - 1;
        }
    });

    if ((this.x > mapObj.width * 100)) this.x = mapObj.width * 100;
    if (this.x < 0) this.x = 0;
}

function moveY(amount, getIndex, mapObj, override) {
    let map = mapObj.map;
    if (this.movementLock && !override) return;
    if (amount == 0) return; //if move by 0 just return
    if (Math.abs(amount) > 60) {
        moveY.bind(this)(amount / 2, getIndex, mapObj, override);
        moveY.bind(this)(amount / 2, getIndex, mapObj, override);
        return;
    }
    if (this.clip) {
        this.moveYclip(amount);
        return;
    }
    //liquid physics
    let currentTile = map[Math.floor(this.x / 100) + Math.floor(this.y / 90) * mapObj.width];
    if (currentTile?.liquid) {
        if (!this.modifiers?.swim)
            amount /= 2;
        this.extrajump.val = this.getExtrajumpsValue();
    }

    let sz = this.sz.val;
    if (sz > 78) sz = 78;

    this.air = true;

    let c = getIndex(this);
    this.y += amount; //sign: 1 = down : -1 = up
    for (let i = 0; i < c.length; i++) {
        let tile = map[c[i]];
        if (tile.goThru(this)) continue;
        //[LEFT, RIGHT, TOP, BOTTOM]
        let intersects = intersectRect(this.getBoundingBox(78), [tile.x, tile.x + 100, tile.y + tile.h, tile.y + 90]);
        //displace th object so it doesnt collide
        if (intersects) {
            this.vY = 0;

            if (Math.sign(amount) == -1) {//moving up
                this.y = tile.y + 90 + (sz / 2) + 1;
            } else {//down
                this.y = tile.y - (sz / 2) - 1 + tile.h;
                this.extrajump.val = this.getExtrajumpsValue();
                this.air = false;
            }
        }
    }
}

function jump(range) {
    if (!this.jump.lock) return 0;
    if (this.extrajump.val <= 0) return;

    this.accessories.map(a => a.onjump(this.game, this));

    let amount = this.getJumpValue();
    this.vY = 0;
    if (!this.modifiers.airplat && this.extrajump.val != this.getExtrajumpsValue())
        amount /= 1.75;
    if (this.modifiers.rocketjump && Date.now() - this.lastmovement > 1000) {
        amount = 10;
    }
    if (this.modifiers.tidal) {
        let mapObj = this.game?.worlds?.[this.world]?.map;
        let currentTile = mapObj?.map[mapObj.at(this.x, this.y)];
        if (currentTile?.liquid)
            amount *= 1.3;
    }
    this.extrajump.val--;
    this.jumping = true;
    this.jump.lock = false;

    this.vY = -(4 * amount*1.85) - 8.5;
    //i hate RANGE
    //range.add(this, 4, function (t, i) {
    //    t.vY = -(i * amount) - 8.5;
    //});
}

(function (root, api) {
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    if (root) root.pmShared = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null), {
    setKey,
    move,
    moveX,
    moveY,
    jump,
    physicsTick
});