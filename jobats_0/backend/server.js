// import dotenv from "dotenv";
// dotenv.config({ path: "./.env" });

// console.log("ENV CHECK:", process.env.GOOGLE_CLIENT_ID);

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import session from "express-session";
// import passport from "passport";

// //import "./config/passport.js";
// import authRoutes from "./routes/auth.js";

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
// app.use(passport.initialize());

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"));

// app.use("/auth", authRoutes);

// app.listen(5000, () => console.log("Backend running on 5000"));
// import dotenv from "dotenv";
// dotenv.config({ path: "./.env" });

// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import session from "express-session";
// import passport from "passport";

// // 🔥 THIS LINE REGISTERS THE GOOGLE STRATEGY
// import "./config/passport.js";

// import authRoutes from "./routes/auth.js";

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(
//   session({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// app.use(passport.initialize());

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"));

// app.use("/auth", authRoutes);

// app.listen(5000, () => console.log("Backend running on 5000"));

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import "./config/passport.js";
import authRoutes from "./routes/auth.js";

console.log("CLIENT ID CHECK:", process.env.GOOGLE_CLIENT_ID);

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));

app.use("/auth", authRoutes);

app.listen(5000, () => console.log("Backend running on 5000"));
