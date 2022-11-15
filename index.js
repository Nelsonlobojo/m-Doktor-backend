// Imports
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

require('dotenv/config');
const api = process.env.API_URL;

// Routers
const doctorRouter = require('./routers/doctor');
const specialityRouter = require('./routers/speciality');
const userRouter = require('./routers/user');
const appointmentRouter = require('./routers/appointment');
const medicalRecordRouter = require('./routers/medicalRecord');
const newsItemRouter = require('./routers/newsItem');
const offlineCallRouter = require('./routers/offlineCall');
const onlineCallRouter = require('./routers/onlineCall');
const reviewRouter = require('./routers/review');
const videoRouter = require('./routers/video');
const chatRouter = require('./routers/chat'); 
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler'); 

// Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//Routes
app.use(`${api}/doctors`, doctorRouter);
app.use(`${api}/specialities`, specialityRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/appointments`, appointmentRouter);
/*app.use(`${api}/medicalRecords`, medicalRecordRouter);
app.use(`${api}/newsItems`, newsItemRouter);
app.use(`${api}/offlineCalls`, offlineCallRouter);
app.use(`${api}/onlineCalls`, onlineCallRouter);
app.use(`${api}/reviews`, reviewRouter);
app.use(`${api}/videos`, videoRouter);
app.use(`${api}/chats`, chatRouter); */


 //Database connection
mongoose.connect( process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to database'))
    .catch((err) => console.log(err)); 

// // Server - development
// app.listen(3000, () => {
//     console.log('Server is running http://localhost:3000');
// });

// // Server - production
var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("Express is working on port " + port);
});
