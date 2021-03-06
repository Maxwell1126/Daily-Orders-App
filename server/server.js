
const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');

const passport = require('./strategies/user.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const createOrderSheetRouter = require('./routes/createOrderSheet.router');
const ordersRouter = require('./routes/orders.router');
const ordersheetRouter = require('./routes/ordersheet.router');
const historyRouter = require('./routes/history.router');
const notesAddRouter = require('./routes/notesAdd.router');
const notesGetRouter = require('./routes/notesGet.router');
const updateordersRouter = require('./routes/updateorders.router');
// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/createOrderSheet', createOrderSheetRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/ordersheet', ordersheetRouter);
app.use('/api/history', historyRouter);
app.use('/api/notesAdd', notesAddRouter);
app.use('/api/notesGet', notesGetRouter);
app.use('/api/updateorders', updateordersRouter);
// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
