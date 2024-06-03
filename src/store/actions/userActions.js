import actionTypes from './actionTypes';
import { reLogin } from '../../services/userService';

export const addUserSuccess = () => ({
    type: actionTypes.ADD_USER_SUCCESS
})

export const userLoginSuccess = (userInfo) => ({
    type : actionTypes.USER_LOGIN_SUCCESS,
    userInfo: userInfo
})
export const userLoginFail = () => ({
    type: actionTypes.USER_LOGIN_FAIL
})

export const processLogout = () => ({
    type: actionTypes.PROCESS_LOGOUT
})
//User relogin
export const userReLoginStart = (inputId) => {
    return async(dispatch, getState)=>{
        try {
            //console.log('input data from userAction: ',inputId)
            let res = await reLogin(inputId);
            //console.log('response from userAction: ',res.user)
            if(res && res.errCode === 0){
                dispatch(userReLoginSuccess(res.user));
            }
            else{
                dispatch(userReLoginFail());
            }
        } catch (e) {
            dispatch(userReLoginFail());
            console.log('User relogin error:', e)
        }
    }
}
export const userReLoginSuccess = (userData) => ({
    type : actionTypes.USER_RELOGIN_SUCCESS,
    userData: userData
})
export const userReLoginFail = () => ({
    type: actionTypes.USER_RELOGIN_FAIL
})