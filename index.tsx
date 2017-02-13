import * as React from 'react'
import { render } from 'react-dom'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import ReduxThunk from 'redux-thunk'

// Helpers
function timeout(milli) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve(); }, milli);
    })
}

// Store creation
interface GlobalState {
    counter: number
}

const counterReducer = (counter: GlobalState['counter'] = 0, action) => {
    switch (action.type) {
        case "INCREMENT":
            return counter + 1
    }
    return counter
}

const store = createStore(
    combineReducers({
        counter: counterReducer,
    }),
    applyMiddleware(ReduxThunk)
)

// Action creator
class Actions {

    dispatch

    constructor(dispatch) {
        console.log(dispatch);
        this.dispatch = dispatch
    }

    sync() {
        this.dispatch({ type: "INCREMENT", });
    }

    async async() {
        await timeout(1000);
        this.sync();
    }

    async everCount() {
        while (true) {
            await timeout(1000);
            this.sync();
        }
    }

    syncThunk() {
        this.dispatch((dispatch) => {
            dispatch({ type: "INCREMENT" });
        });
    }

    asyncThunk() {
        this.dispatch(async (dispatch, getStore) => {
            console.log("You can getStore()", getStore());

            await timeout(1000);
            this.syncThunk();
        });
    }

    everCountThunk () {
        this.dispatch(async (dispatch, getStore) => {
            const initCount = getStore().counter
            while (getStore().counter - initCount < 10) {
                await timeout(1000);
                this.syncThunk();
            }
        });
    }

}

// React app

class CounterApp extends React.Component<{ count: number, actions: Actions }, void> {
    render() {
        return (
            <section>
                <h1>Redux thunk + async await</h1>

                <p>{this.props.count}</p>

                <section>
                    <h2>With Action class</h2>
                    <p>
                        <button onClick={() => this.props.actions.sync()} >Sync count</button>
                        <button onClick={() => this.props.actions.async()}>Async count</button>
                        <button onClick={() => this.props.actions.everCount()}>Ever count</button>
                    </p>
                </section>

                <section>
                    <h2>With action creator (redux-thunk)</h2>
                    <p>
                        <button onClick={() => this.props.actions.syncThunk()} >Sync count</button>
                        <button onClick={() => this.props.actions.asyncThunk()}>Async count</button>
                        <button onClick={() => this.props.actions.everCountThunk()}>Ever count</button>
                    </p>
                </section>

            </section>
        )
    }
}

const ConnectedCounterApp = connect(
    (state: GlobalState) => ({ count: state.counter }),
    (dispatch) => ({ actions: new Actions(dispatch) }),
)(CounterApp)

const app = document.getElementById("app")
render(<Provider store={store}><ConnectedCounterApp /></Provider>, app)
