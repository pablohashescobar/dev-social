import axios from 'axios';
import { setAlert } from './alert';

import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST } from './types';

//Get all posts
export const getPosts = () => async (dispatch) => {
    try {
        const res = await axios.get('/api/posts');

        dispatch({
            type: GET_POSTS,
            payload: res.data,
        });
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

//Like A Post
export const addLike = (id) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/posts/like/${id}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: {
                id,
                likes: res.data,
            },
        });
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

//Remove Like
export const removeLike = (id) => async (dispatch) => {
    try {
        const res = await axios.put(`/api/posts/unlike/${id}`);

        dispatch({
            type: UPDATE_LIKES,
            payload: {
                id,
                likes: res.data,
            },
        });
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};

//Delete Post
export const deletePost = (id) => async (dispatch) => {
    try {
        await axios.delete(`/api/posts/${id}`);

        dispatch({
            type: DELETE_POST,
            payload: id,
        });
        dispatch(setAlert('Post has been deleted', 'success'));
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: {
                msg: error.response.statusText,
                status: error.response.status,
            },
        });
    }
};