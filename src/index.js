import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { selectSubreddit, fetchPosts,fetchPostsIfNeeded } from './actions/actions'
import rootReducer from './reducers/reducers'

const loggerMiddleware = createLogger();

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware, // 允许我们 dispatch() 函数
    loggerMiddleware // 一个很便捷的 middleware，用来打印 action 日志
)(createStore);

const store = createStoreWithMiddleware(rootReducer);

store.dispatch(selectSubreddit('reactjs'));

store.dispatch(fetchPosts('reactjs')).then(() =>
        console.log(store.getState())
);


store.dispatch(fetchPostsIfNeeded('reactjs')).then(() =>
        console.log(store.getState())
);
//返回一个已经解决的promise对象
console.log('Promise.resolve--->>',Promise.resolve());