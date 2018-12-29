const IDLE = 'idle';
const TRAVELLING = 'travelling';
const OPENING = 'opening';
const CLOSING = 'closing';
const PARKING = 'parking';




function idle(ctx) {
    var elapsedTime = 0;
    var enterTime;
    const parkingTimer = 10;

    return { 
        call(targetFloor) {
            if (targetFloor != ctx.floor) {
                ctx.targetFloor = targetFloor;
                ctx.state = TRAVELLING;
            }
        },
        update(time) {
            if (ctx.floor != 0) {
                if (enterTime !== undefined){
                    elapsedTime = time - enterTime;
                } else { 
                    enterTime = time;
                }
                if (elapsedTime > (parkingTimer * 1000)) {
                    ctx.state = PARKING;
                } 
            }
            
        },
        leave() {
            elapsedTime = 0;
            enterTime = undefined;
        }
    };
}



function travelling(ctx) {
    const speed = -5; // cause y grows downwards
    var v = 0;

    return {
        enter() {
            ctx.targetPos = ctx.getFloorPos(ctx.targetFloor);
            v = ctx.floor < ctx.targetFloor ? speed : -speed;
        },
        update(time) {
            if ((v < 0 && ctx.y > ctx.targetPos) ||
                (v > 0 && ctx.y < ctx.targetPos)) {
                
                ctx.y += v;
            } else {
                ctx.y = ctx.targetPos;
                ctx.state = IDLE;
            }
        }, 
        leave() {
            v = 0;
            ctx.floor = ctx.targetFloor;
        },
    };
}



function parking(ctx) {
    var speed = -5; // cause y grows downwards
    var v = 0;

    return {
        enter() {
            ctx.targetPos = ctx.getFloorPos(0);
            v = -speed; // Assuming there are no floors under the basement
        }, 
        call(targetFloor) {
            if (targetFloor != 0) {
                ctx.targetFloor = targetFloor;
                ctx.state = TRAVELLING;
            }
        }, 
        update(time) {
            if ( ctx.y < ctx.targetPos ) {
                ctx.y += v;
            } else {
                ctx.y = ctx.targetPos;
                ctx.state = IDLE;
            }
        }, 
        leave() {
            v = 0;
            ctx.floor = 0;
        }
    };
}



export default {IDLE, TRAVELLING, PARKING, idle, travelling, parking};