import FSM from './fsmOOP.js';
import states from './states.js';

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
    if (callFloor) elevatorFSM.execute('call', callFloor);
}

var animFrame;

var elevatorFSM = FSM.createContext({
    targetFloor: 0, 
    floor:3,
    y: floor_ypos[3],
    getFloorPos(floor) {
        return floor_ypos[floor];
    }, 
    update(time) {
        animFrame =  window.requestAnimationFrame(elevatorFSM.update);
        elevatorFSM.state.update(time);
        elevatorDisplay.style.top = elevatorFSM.y + 'px';
    }, 
    start() {
        animFrame =  window.requestAnimationFrame(elevatorFSM.update);
    },
    stop() {
        window.cancelAnimationFrame(animFrame);
    }
});

elevatorFSM.addState(states.IDLE, states.idle);
elevatorFSM.addState(states.TRAVELLING, states.travelling);
elevatorFSM.addState(states.PARKING, states.parking);

elevatorFSM.state = states.IDLE;
elevatorFSM.start();