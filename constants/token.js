const TOKEN = "AIzaSyA08r-2huiNtt16Lo6gKc2EgZ8vFplP3RM";

export default {
  signUpToken: `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${TOKEN}`,
  signInToken: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${TOKEN}`,
};
