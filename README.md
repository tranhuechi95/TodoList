This project was my practice with REST API and usage of No SQL database.

## To start

1) Download this repository to your computer.

2) Install the necessary dependencies using `npm install`.

3) Build the website with `npm run build`.

4) Start the website at [http://localhost:3000](http://localhost:3000) by running `npm run start`.

### Personal learning point

1) To implement the server to receive the request from the client side, I need to make it the same process. i.e same port. Otherwise, we will not be able to view the request content (non-cors).

2) To make both server and client to have the same process, the GET api of the server will serve the React front end part. We need to build the website first with `npm run build` first to convert the React front end into javascript  (jsx -> js). Here, we add `app.use(express.static("build"))` to the server.js file so that the GET method will render the web app from build folder.

3) The todoList is implemented as an `array`. As such, to handle update, delete functions, I made use of `filter` and `map` functions of array. On server side, the listItems is implemented as an `array` too.

4) To make sure the `update` and `delete` selection are updated when there is only one choice to select, I need to set the state of Id to select/delete to the added item so that it does not stay with the initial state.

5) For the MongoDB database, I need to make sure the web app is `in sync` with the db. This is done with the `useEffect` hook. When the web app is first loaded, the web app `fetch` the data from the db and set the todoList in the web app.

6) For update and delete of the MongoDB, I used the Id in the db for those purpose. However, I encountered the problem of which id to be used? Should I use the db generated `_id` (unique) or my own `id`.
  
  a) For the db generated `_id`, its data type is `Object`. Hence, when the Update/Delete Id, which has `string` data type, is passed into the Update and Delete function of db, it won't match. So the data was not updated or deleted. Hence, I cannot use `_id` by db!
  
  b) For my own `id`, there were a few options to generate the unique id. One is to use `Math.random()`, two is to use `Date()` and three is to use id with `+1` increment.
  
  For One, I cannot guarantee that the generated `id` is random.
  
  For Two, the `id` store in the db and the `id` recorded in Update/Delete id are of different forms. This leads to the same problem as a).
  
  For Three, I get maximum `id` during the initial fetching in 5). With this maximum `id`, any subsequent items added will have `id` larger than the maximum `id` (max id ++). This ensure that the `id` will be unique. By using the `<form>` tag in React, the Update/Delete id is in `string` data type. As such, before passing to the db for update/delete or for client side update/delete using `map/filter`, I need to `parseInt` the `id` first.
  
7) The second phase of this project was to implement login/signup capability i.e. user authentification. For this purpose, I created a login/signup page as the `/` page, user can only access his/her `todolist` after successful login.

8) For login/signup page, I did some error checking on client side as well as server side with database.

a) For client side, on signup, the initial and retyped password must match. TO FOLLOW UP: i would want to implement further checking on no `whitespace` in username or password; password must be at least 8 chars, alphanumeric.

b) For server side, on signup, I do not allow duplicate username. This was done by checking whether the username provided by user was already inside the db.
For login, I checked whether the username provided already exists in db. If it doesn't, I would prompt the user to signup. As for existing usernme, I would check whether the password matches. TO FOLLOW UP: I would want to hash the password and compare the hashed password with the one (hashed) stored in the db.

9) After the user has successfully logged in, the web app would automatically directs the user to their own todolist with the link `/todolist/:username`. This was done using `useHistory`

```
  let history = useHistory();
  history.push(`/todolist/${loginInputUsername}`);  
```
10) Each user's todolist is store in the db as a collection with his/her username as collection's name. I retrieve the `username` from the link path through `{match}` in the link with `let {params: {username}} = match`. With this, the variable `username` will store the user's username. Using this `username`, I can pass it during add, update, delete requests to the server.

11) UPCOMING: TO FINISH UP WITH THE TO FOLLOW UP ABOVE and TO Redirect user to login page if he/she tries to access the todolist using the link path `/todolist/username`.
