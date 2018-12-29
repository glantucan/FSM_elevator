
function createContext (contextObj) {

    var state = undefined;
    var states = {};
    var timer;

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

    return {
        ...contextObj,
        execute(action, ...payLoad) {
            if (state) {
                if (state[action]) {
                    state[action](...payLoad);
                }
            }
        }, 
        set state(newState) { 
            setState(newState); 
        }, 
        get state() {
            return state;
        },
        addStates(stateFactoriesObj) {
            var newStatesObj = {}
            for (var stateName in stateFactoriesObj) {
                newStatesObj[stateName] = stateFactoriesObj[stateName](this);
            }
            states = {...states, ...newStatesObj};
        },
        setStateLater(state, delay) {
            timer = setTimeout(() => setState(state), delay*1000);
        },
        cancelStateLater() {
            clearTimeout(timer);
        }
    };
}

export default { createContext };


