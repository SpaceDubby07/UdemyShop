import { AUTHENTICATE, LOGOUT } from '../actions/auth';

// initial state, token is null, userid is null
const initialState = {
  token: null,
  userId: null
};

// export the initial state, and an action
export default (state = initialState, action) => {
  switch (action.type) {
    // type: AUTHENTICATE
    case AUTHENTICATE:
      //return the token and userId
      return {
        token: action.token,
        userId: action.userId
      };

    // type: LOGOUT
    // if we logout we just want to return our initial authentication state. null data.
    case LOGOUT:
      return initialState;
    // case SIGNUP:
    //   return {
    //     token: action.token,
    //     userId: action.userId
    //   };
    default:
      return state;
  }
};
