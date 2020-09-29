## MutriFacts

#### https://mutrifacts.herokuapp.com

Music Nutrition Facts: See details about audio features of songs in a playlist in the form of a downloadable nutrition label. A project I did for fun, primarily built with React, Javascript, and CSS.

As specified in Spotify's Web API documentation, when the user logs in, they must authorize the following scopes in order for this app to be able to read user playlist info and basic user info: `playlist-read-private`, `playlist-read-collaborative`, and `user-read-email`.

(This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).)


## Screenshots

#### Example:   
<img src="https://github.com/ayshih2/mutrifacts/blob/master/nutrition-label-example.png" width="400" alt="label example screenshot">

## How to Run
### Setup
Clone this repository. You will need `node` and `npm` installed globally on your machine. Must also create/register the app in your Spotify Developer account to get a Client ID and secret. Before you run the following commands, you'll have to go to the code and make sure you set the proper environment variables for the following:

*For server.js:*
`CLIENT_ID`
`CLIENT_SECRET`
`REDIRECT_URI`
`FRONTEND_URI`

*For App.js:*
`REACT_APP_LOGIN_URI
REACT_APP_LOCAL_LOGIN_URI`

*For Gallery.js:*
`REACT_APP_LOGOUT_URI`
`REACT_APP_LOCAL_LOGOUT_URI`


### Commands
### `node server.js`

Run Node.js/Express backend in development mode. A redirect URI, like `http://localhost:8888/callback`, must be white-listed in your Spotify Dashboard.

To initialize the login flow:
`http://localhost:8888/login`

### `npm start`

Run React front-end in development mode. Must have the server running as well for it to work properly. The page will reload if you make edits.
  
To visit the web app locally:
`http://localhost:3000`  

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
