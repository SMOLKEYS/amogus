let killRange = 480;
let killCooldown = 0;

let amogus = extend(UnitType, "amogus", {
    health: 6969,
    hitSize: 16,
    speed: 1,
    drawCell: false,

    init(){
        if(!this) return;
        this.super$init()
        this.killCooldown = 0;
        this.target = null;
    },

    update(u){
        let aimX = Math.floor(u.mounts[0].aimX);
        let aimY = Math.floor(u.mounts[0].aimY);
        let relativeX = aimX - u.x
        let relativeY = aimY - u.y
        this.target = Units.closest(u.team, aimX, aimY, 8, t => {
            return (!t.dead && (t != u)) && Mathf.within(relativeX, relativeY, killRange)
        });

        this.killCooldown--
        this.killCooldown = Mathf.clamp(this.killCooldown, 0, killCooldown)

        // this can kill multiple units for some reason but i dont give a shit
        if(u.isShooting && (this.target != null) && (this.killCooldown <= 0)){
            this.target.kill()
            u.vel.set(u.vel.x + (relativeX/2), u.vel.y + (relativeY/2))
            this.killCooldown = killCooldown

            let angle = Angles.angle(u.x, u.y, this.target.x, this.target.y)
            require("amogusEffect").at(this.target.x, this.target.y, angle)
        }
    },

});

amogus.constructor = () => extend(MechUnit, {});
amogus.weapons.add(require("sus"));