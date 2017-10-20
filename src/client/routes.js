import HomePage from './containers/HomePage.js';
// import LoginPage from './containers/LoginPage.js';
// import SignUpPage from './containers/SignUpPage.js';
import Auth from './modules/Auth';


// const routes = {
//   component: HomePage,
//   childRoutes: [
    // {
    //   path: '/',
    //   getComponent: (location, callback) => {
    //     if (Auth.isUserAuthenticated()) {
    //       callback(null, HomePage);
    //     } else {
    //       console.log('Hello');
    //       callback(null, HomePage);
    //     }
    //   }
    // }

    // {
    //   path: '/login',
    //   component: LoginPage
    // },
    //
    // {
    //   path: '/signup',
    //   component: SignUpPage
    // },
    //
    // {
    //   path: '/logout',
    //   onEnter: (nextState, replace) => {
    //     Auth.deauthenticateUser();
    //
    //     // change the current URL to /
    //     replace('/');
    //   }
    // }

//   ]
// };
const routes = {
  [
    path: '/',
    component: HomePage
  ]
};

export default routes;
