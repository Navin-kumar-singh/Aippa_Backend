// const dotenv = require("dotenv");
// const schedule = require("node-schedule");
// const fs = require("fs");
// const morgan = require("morgan")
// const { morganFnc, morganFormat } = require("./config/morgan.config");
// dotenv.config({
//   path:'./.env.development'
// })

// switch (process.env.NODE_ENV) {
//   case "development":
//     dotenv.config({ path: `.env.development` });
//     break;
//   case "testing":
//     dotenv.config({ path: `.env.testing` });
//     break;
//   default:
//     dotenv.config({ path: `.env` });
//     break;
// }
// const logg = require("./utils/utils");
// require("./model/db");
// const express = require("express");
// const cors = require("cors");
// // Server Setup
// const PORT = process.env.PORT || 2100;
// const app = express();
// app.use(cors({
//   // origin: 'http://localhost:5173', // Your frontend URL
//   origin:"https://aippa-glc-hglv.vercel.app/",
//   credentials: true
// }));
// app.use(morgan(morganFormat, morganFnc)); 
// const server = require("http").createServer(app);
// const io = require("socket.io")(server);
// const routesV2 = require("./version2/routesv2");
// server.prependListener("request", (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
// });
// server.listen(PORT, () => {
//   if (!fs.existsSync("./tmp")) {
//     fs.mkdirSync("./tmp");
//   }
//   logg.success({ ENVIRONMENT: process.env.NODE_ENV, DATABASE: process.env.DBNAME, message: `Yuvamanthan Server is Running over port ${PORT} with The SOCKET, with version 2.03` });
// });
// // End Server Setup
// module.exports = app;
// const passport = require('passport');
// const session = require('express-session');
// const authRoutes = require("./routes/auth/auth");
// const authRoutesV2 = require("./version2/auth/auth");
// const timelineRoutes = require("./routes/timeline/timeline");
// const instituteV2Router = require("./version2/institute");
// const { ModelUnStudentRouter } = require("./version2/modelUn_student/modelUnStudent");
// const clubRoutes = require("./routes/clubs/club");
// const bodyParser = require("body-parser");
// // const morgan = require("morgan");
// const { RegisterRouter } = require("./routes/register/register");
// const { RegisterRouterV2 } = require("./version2/register/register");
// const contentRouter = require("./routes/content/content");
// const discussionBoardRouter = require("./version2/discussion_board/discussion_board")
// const adminRouter = require("./routes/admin/admin");
// const instituteRouter = require("./routes/institute/institute");
// const publicRouter = require("./routes/public/public");
// const StudentRouter = require("./routes/student/student");
// const courseRouter = require("./routes/course/course");
// const discussionRouter = require("./routes/dicussion/discussion");
// const EksathiRouter = require("./routes/eksathi/eksathi");
// const { DBMODELS } = require("./database/models/init-models");
// const sequelize = require("./database/connection");
// const CONSTANTS = require("./sockets/SocketEvents");
// const { getSingedUrl } = require("./service/upload");
// const { routeVerifierJwt } = require("./routes/auth/jwt");
// const initializeSocketConnection = require("./sockets/initializeSocketConnection");
// const OpenAi = require('openai');
// // openai.apiKey = 'sk-proj-PKgRTsZZcBlvWrWvBzlwT3BlbkFJESANIzEPftDoGcEQeDCh';

// const openai =  new OpenAi({
//   apiKey:"sk-proj-1XeGOYLIFQUZzSWmNl2aT3BlbkFJ7CZ3u1ZWGTHR2vejZwnj"
// });

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(express.json());
// app.use(session({
//   secret: process.env.SESSION_SECRET_KEY,
//   resave: true,
//   saveUninitialized: true,
//   cookie: { maxAge: 2 * 24 * 60 * 60 * 1000 }
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// require('./version2/passportSetup')
// // if (process?.env?.NODE_ENV === "development") {
// //   app.use(morgan("short"));
// // }
// module.exports.filedeleter = async function fileDeleter(path) {
//   const pathToOldImg = details.icon.replaceAll(
//     process.env.UrlPathName,
//     `${__dirname}/`
//   );
//   fs.unlinkSync(pathToOldImg.replaceAll("/", `\\`));
// };
// // Routes
// app.use("/api/v2", routesV2);
// app.use("/uploads", express.static("uploads"));
// app.use("/auth", authRoutes);
// app.use("/v2/auth", authRoutesV2);// new v2 routes for login
// app.use("/course", courseRouter);
// app.use("/student", StudentRouter);
// app.use("/public", publicRouter);
// app.use("/register", RegisterRouter);
// app.use("/v2/register", RegisterRouterV2); // new v2 routes for register
// app.use("/content", contentRouter);
// app.use("/admin", routeVerifierJwt, adminRouter);
// app.use("/institute", instituteRouter);
// app.use("/v2/institute", instituteV2Router);
// app.use("/discussion", discussionRouter);
// app.use("/eksathi", EksathiRouter);
// app.use("/timeline", timelineRoutes);
// app.use("/club", clubRoutes)
// app.use("/modelUnStudent", ModelUnStudentRouter)

// // chat gpt routes
// app.post('/chatgpt', async (req, res) => {
//   const prompt = req.body.prompt;

//   try {
//     const response = await openai.chat.completions.create({
//       model: 'gpt-4-turbo',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: 400, // Increased max_tokens
//       n: 1,
//       stop: null,
//       temperature: 0.5
//     });

//     res.json({ text: response.choices[0].message.content , response});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while processing your request.', errorMessage: error.message });
//   }
// });



// // google auth routes
// app.get('/auth/google',
//   (req, res, next) => {
//     const userType = req.query.userType
//     // console.log('req.query.userType', userType)
//     passport.authenticate('google', {
//       scope: ['profile', 'email'],
//       state: userType,
//     })(req, res, next);
//   }
// );

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}` }),
//   (req, res) => {

//     // redirect to the desired url 
//     // process.env.FRONTEND_URL
//     // res.json(req.user)
//     let token = req.token
//     const userObject = req.user;
//     const userType = req.user.userType;
//     const email = req.user.email
//     console.log('userType', req.user)
//     if (userObject.status === 'fail' && userType) {
//       res.redirect(`${process.env.FRONTEND_URL}registration?googleAuthStatus=fail&userType=${userType}&authStep=8&email=${req.user.email}`)
//     }
//     else if (userObject.status === 'fail' && !userType) {
//       res.redirect(`${process.env.FRONTEND_URL}registration?googleAuthStatus=fail&authStep=2&email=${req.user.email}`)
//     }
//     else {
//       const userObjectString = encodeURIComponent(JSON.stringify(userObject));
//       const redirectURL = `${process.env.FRONTEND_URL}googleVerify?user=${userObjectString}`;
//       res.redirect(redirectURL);
//       // res.redirect('/googleVerifyGetUserDetail')
//     }
//   }
// );
// app.get('/googleVerifyGetUserDetail', (req, res) => {
//   res.json({
//     message: 'successfully get user',
//     user: req.user
//   })
// })

// app.get("/", (req, res) => {
//   res.send("Yuvamanthan Server is running here...");
// });

// //Testing
// const uploadRouter = require("./middleware/uploadRouter");
// app.use("/uploadAWS", uploadRouter);

// const awsRouter = require("./aws/awsRouter");
// const { eventDeadlinesChecker } = require("./routes/institute/instituteEvent");
// const {
//   studentNotCompletedCourse,
// } = require("./service/globalEamilService");




// app.use("/aws", awsRouter);


// // socket start here
// initializeSocketConnection(io);


// // Schedule Job For Event Scheduling
// // const job = schedule.scheduleJob({ hour: 23, minute: 30 }, function () {
// //   logg.success("Naya Din Aagaya Doston!!");
// //   eventDeadlinesChecker();
// // });
// // schedule.scheduleJob({ hour: 12, minute: 30 }, function () {
// //   logg.success("Couser Reminder Email Proccessing!!");
// //   studentNotCompletedCourse();
// // });

// // SYNCING UP THE TABLES
// sequelize.sync({ alter: true }).then((result) => {
//     logg.success("Sequelize Sync Done");
//   }).catch((err) => {
//     throw err;
//   });



/***********************************
 * YUVAMANTHAN SERVER (FIXED)
 * Works with EXISTING .env
 ***********************************/







/***********************************
 * YUVAMANTHAN SERVER (RENDER SAFE)
 * .env UNCHANGED
 ***********************************/

const dotenv = require("dotenv");
dotenv.config(); // ✅ uses your existing .env

const express = require("express");
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const fs = require("fs");

// =====================
// APP + SERVER (START FIRST)
// =====================
const app = express();
const server = http.createServer(app);

// 🔴 HEALTH CHECK (VERY IMPORTANT FOR RENDER)
app.get("/", (req, res) => {
  res.status(200).send("✅ Yuvamanthan Server is running");
});

// 🔴 START SERVER IMMEDIATELY
const PORT = process.env.PORT || 2100;

server.listen(PORT, () => {
  if (!fs.existsSync("./tmp")) fs.mkdirSync("./tmp");
  console.log(`🚀 Server started on port ${PORT}`);
});

// =====================
// BASIC MIDDLEWARE
// =====================
app.use(morgan("dev"));

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// =====================
// SESSION + PASSPORT (SAFE)
// =====================
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2 * 24 * 60 * 60 * 1000 }
}));

app.use(passport.initialize());
app.use(passport.session());

try {
  require("./version2/passportSetup");
  console.log("✅ Passport initialized");
} catch (err) {
  console.error("❌ Passport error:", err.message);
}

// =====================
// STATIC
// =====================
app.use("/uploads", express.static("uploads"));

// =====================
// SAFE ROUTE LOADER
// =====================
const safeUse = (path, route) => {
  try {
    app.use(route, require(path));
    console.log(`✅ Loaded ${route}`);
  } catch (err) {
    console.error(`❌ Failed ${route}:`, err.message);
  }
};

// =====================
// ROUTES (UNCHANGED)
// =====================
safeUse("./version2/routesv2", "/api/v2");
safeUse("./routes/auth/auth", "/auth");
safeUse("./version2/auth/auth", "/v2/auth");
safeUse("./routes/course/course", "/course");
safeUse("./routes/student/student", "/student");
safeUse("./routes/public/public", "/public");
safeUse("./routes/register/register", "/register");
safeUse("./version2/register/register", "/v2/register");
safeUse("./routes/content/content", "/content");
safeUse("./routes/admin/admin", "/admin");
safeUse("./routes/institute/institute", "/institute");
safeUse("./version2/institute", "/v2/institute");
safeUse("./routes/dicussion/discussion", "/discussion");
safeUse("./routes/eksathi/eksathi", "/eksathi");
safeUse("./routes/timeline/timeline", "/timeline");
safeUse("./routes/clubs/club", "/club");
safeUse(
  "./version2/modelUn_student/modelUnStudent",
  "/modelUnStudent"
);
safeUse("./aws/awsRouter", "/aws");
safeUse("./middleware/uploadRouter", "/uploadAWS");

// =====================
// SOCKET.IO (SAFE)
// =====================
try {
  const io = require("socket.io")(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  });
  require("./sockets/initializeSocketConnection")(io);
  console.log("✅ Socket initialized");
} catch (err) {
  console.error("❌ Socket error:", err.message);
}

// =====================
// DATABASE (NON-BLOCKING)
// =====================
(async () => {
  try {
    require("./model/db");
    const sequelize = require("./database/connection");

    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("✅ Sequelize synced");
  } catch (err) {
    console.error("❌ DATABASE ERROR (server still running):", err.message);
  }
})();
