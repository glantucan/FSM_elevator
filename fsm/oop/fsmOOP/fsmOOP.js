
function createContext (contextObj) {

    var state = undefined;
    var states = {};
    var context;

    function execute(action, ...payLoad) {
        if (state) {
            if (state[action]) {
                state[action](...payLoad);
            }
        }
    }
    
    function setState(newState) {
        console.log('setting state to ' + newState.toUpperCase());
        if (states[newState]) {
            if (state && state.leave) {
                state.leave();
            }
            state = states[newState];
            if (state.enter) state.enter();
        } else {
            throw Error(newState + ' is not defined!!');
        }
    }

    function addState(stateName, stateFactory){
        if (!states[stateName]) {
            states[stateName] = stateFactory(context);
        } else {
            throw Error(stateName + ' already exists!!');
        }
    }

    context = {
        ...contextObj,
        execute, 
        set state(newState) { 
            setState(newState); 
        }, 
        get state() {
            return state;
        },
        addState,
    };
    return context;
}

export default { createContext };


