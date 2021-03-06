class FSM {
    constructor(config) {
        if (config == undefined) {
        throw new Error("arguments are necessary");
     }
        this.config = config;
		this.initial = this.config.initial;
        this.prevState = null;
		this.stackRedo = [];
		this.stackUndo = [];
    }

    getState() {
        return this.initial;
    }

    changeState(state) {
		if(state == undefined) {
            throw new Error("arguments are necessary");
        }
        if(state in this.config.states){
            this.prevState = this.initial;
            this.initial = state;
			this.stackUndo.push(this.prevState);
			this.stackRedo = [];
        } else {
            throw new Error("does not exist");
        }
    }

    trigger(event) {
        if (event == undefined) {
            throw new Error("arguments are necessary");
        }
		if(event in this.config.states[this.initial].transitions) {
            this.prevState = this.initial;
            this.initial = this.config.states[this.initial].transitions[event];
			this.stackUndo.push(this.prevState);
			this.stackRedo = [];
        } else {
            throw new Error("does not exist");
        }
    }
    
    reset() {
        this.prevState = null;
        this.initial = this.config.initial;
		this.canRedo = false;
		this.stackRedo = [];
		this.stackUndo = [];
    }

    getStates(event) {
		var states = [];
		if (event == undefined) {
			for(var key in this.config.states) {
            	states.push(key);
            }
			return states;
		}
		for(var key in this.config.states) {
            if( event in this.config.states[key].transitions) {
                states.push(key);
            }
		}
		return states;
	}

    undo() {
        if(this.stackUndo.length != 0) {
			var state = this.initial;
			this.stackRedo.push(state);
			this.initial = this.prevState; 
            this.prevState = state;
			this.stackUndo.pop();
			return true;
		} else {
			return false;
		}
    }
        
    redo() {
        if(this.stackRedo.length != 0) {
			var state = this.initial;
			this.stackUndo.push(state);
			this.initial = this.prevState; 
            this.prevState = state;
			this.stackRedo.pop();
			return true;
		} else {
			return false;
		}
    }

    clearHistory() {
		this.prevState = null;
		this.stackRedo = [];
		this.stackUndo = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
