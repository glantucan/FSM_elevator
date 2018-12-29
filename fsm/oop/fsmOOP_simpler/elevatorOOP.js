import FSM from './fsmOOP.js';

var elevatorDisplay = document.querySelector('.elevator');
var floor_ypos = [...document.querySelectorAll('.floor .ceiling')]
                .map(function(element) {
                    return element.getBoundingClientRect().top;
                })
                .reverse();
var building = document.querySelector('.building');

building.addEventListener('click', clickHandler);
elevatorDisplay.style.top = floor_ypos[3] + 'px';

function clickHandler(ev) {
    var targetClasses = [...ev.target.classList];
    var callFloor;
    if (targetClasses.includes('call-button')) {
        callFloor = ev.target.parentNode.parentNode.className.split('_')[1];
    } else if (targetClasses.includes('button')) {
        callFloor = ev.target.className.split('_')[1];
    }
    if (callFloor){
        elevatorFSM.execute('call', callFloor);
    } 
}

var animFrame;

var elevatorFSM = FSM.createContext({
    targetFloor: 0, 
    floor:3,
    y: floor_ypos[3],
    speed: -5, // cause y grows downwards
    v: 0,
    getFloorPos(floor) {
        return floor_ypos[floor];
    }, 
    update(time) {
        animFrame =  window.requestAnimationFrame(elevatorFSM.update);
        elevatorFSM.execute('update', time);
        elevatorDisplay.style.top = elevatorFSM.y + 'px';
    }, 
    start() {
        animFrame =  window.requestAnimationFrame(elevatorFSM.update);
    },
    stop() {
        window.cancelAnimationFrame(animFrame);
    }
});


elevatorFSM.addStates( {
    idle: function (ctx) {
        return {
            enter() {
                if (ctx.floor != 0) ctx.setStateLater('parking', 5);
            },
            call(targetFloor) {
                if (targetFloor != ctx.floor) {
                    ctx.state = 'travelling';
                    // We could specify the targetFloor as the parameter to be passed to the enter function of the next state.
                    actions.setTargetMovementMagnitudes(ctx, targetFloor);
                }
            },
            leave() {
                ctx.cancelStateLater();
            }
        };
    },
    travelling: function(ctx) {
        return {
            update(time) {
                actions.moveTowardsTarget(ctx, time);
                // To express transition declaratively I'd need to define a delayed conditional transition (call it an animated delay) the animation update function should return false until the target position is reached and then return true. Sounds like an iterator-generator candidate.
            }, 
            leave() {
                actions.resetTargetMovementMagnitudes(ctx);
            },
        };
    },
    parking: function(ctx) {
        return {
            enter() {
                actions.setTargetMovementMagnitudes(ctx, 0);
            }, 
            call(targetFloor) {
                if (targetFloor != 0) {
                    ctx.state = 'travelling';
                    actions.setTargetMovementMagnitudes(ctx, targetFloor);
                }
            }, 
            update(time) {
                actions.moveTowardsTarget(ctx, time);
            }, 
            leave() {
                actions.resetTargetMovementMagnitudes(ctx);
            }
        };
    }
});


var actions = {
    moveTowardsTarget(ctx, time) {
        if ((ctx.v < 0 && ctx.y > ctx.yDest) || (ctx.v > 0 && ctx.y < ctx.yDest)) {
            ctx.y += ctx.v;
        } else {
            ctx.y = ctx.yDest;
            ctx.state = 'idle';
        }
    }, 
    moveToPark(ctx, time) {
        if ( ctx.y < ctx.yDest ) {
            ctx.y += ctx.v;
        } else {
            ctx.y = ctx.yDest;
            ctx.state = 'idle';
        }
    },
    setTargetMovementMagnitudes(ctx, targetFloor) {
        ctx.targetFloor = targetFloor;
        ctx.yDest = ctx.getFloorPos(ctx.targetFloor);
        ctx.v = ctx.floor < ctx.targetFloor ? ctx.speed : -ctx.speed;
    },
    resetTargetMovementMagnitudes(ctx) {
        ctx.v = 0;
        ctx.floor = ctx.targetFloor;
    }
}

elevatorFSM.state = 'idle';
elevatorFSM.start();