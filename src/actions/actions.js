import fetch from 'isomorphic-fetch'

// 用户操作action
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export function selectSubreddit(subreddit) {
    return {
        type: SELECT_SUBREDDIT,
        subreddit
    }
}

// 用户操作action 刷新
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'
export function invalidateSubreddit(subreddit) {
    return {
        type: INVALIDATE_SUBREDDIT,
        subreddit
    }
}

//网络操作 请求帖子
export const REQUEST_POSTS='REQUEST_POSTS'
export function requestPosts(subreddit){
    return {
        type:REQUEST_POSTS,
        subreddit
    }
}
//网络操作 接收帖子
export const RECEIVE_POSTS='RECEIVE_POSTS'
export function receivePosts(subreddit,json){
    return {
        type:RECEIVE_POSTS,
        subreddit,
        posts: json.data.children.map(child => child.data),
        receivedAt: Date.now()
    }
}

//思考完action之后，就要考虑state树，如何构建了

//构建异步action
export function fetchPosts(subreddit){
    // 这里把 dispatch 方法通过参数的形式传给函数，
    // 以此来让它自己也能 dispatch action。
    return function(dispatch){
        // 首次 dispatch：更新应用的 state 来通知
        // API 请求发起了。
        dispatch(requestPosts(subreddit))

        // thunk middleware 调用的函数可以有返回值，
        // 它会被当作 dispatch 方法的返回值传递。

        // 这个案例中，我们返回一个等待处理的 promise。
        // 这并不是 redux middleware 所必须的，但这对于我们而言很方便。

        return fetch(`http://www.subreddit.com/r/${subreddit}.json`)
            .then(response => response.json())
            .then(json =>

                // 可以多次 dispatch！
                // 这里，使用 API 请求结果来更新应用的 state。

                dispatch(receivePosts(subreddit, json))
        );

        // 在实际应用中，还需要
        // 捕获网络请求的异常。

    }
}


function shouldFetchPosts(state, subreddit) {
    const posts = state.postsBySubreddit[subreddit]
    if (!posts) {
        return true
    } else if (posts.isFetching) {
        return false
    } else {
        return posts.didInvalidate
    }
}

export function fetchPostsIfNeeded(subreddit) {

    // 注意这个函数也接收了 getState() 方法
    // 它让你选择接下来 dispatch 什么。

    // 当缓存的值是可用时，
    // 减少网络请求很有用。

    return (dispatch, getState) => {
        if (shouldFetchPosts(getState(), subreddit)) {
            // 在 thunk 里 dispatch 另一个 thunk！
            return dispatch(fetchPosts(subreddit))
        } else {
            // 告诉调用代码不需要再等待。
            return Promise.resolve()
        }
    }
}