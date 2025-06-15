import './config/env.js'
import connectDB from "./lib/connectDB.js"
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import questionRoutes from "./routes/question.route.js";
import answerRoutes from "./routes/answer.route.js";
import commentRoutes from "./routes/comments.route.js";
import globalMiddleware from './middlewares/globalMiddleware.js'
import moderationRoutes from './routes/moderation.route.js'
import materialroutes from './routes/material.route.js'
import messageRoutes from './routes/messages.route.js'
import "./config/passport.js";
import { app, server } from './lib/server.js';

globalMiddleware(app);
// Routes
//app.use for middlewaresss
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/question", questionRoutes);
app.use("/answer", answerRoutes);
app.use("/comment", commentRoutes);
app.use("/moderation", moderationRoutes);
app.use("/material", materialroutes);
app.use("/messages", messageRoutes);



//this is for testing
app.get("/test",(req,res)=>{
    res.status(200).send("it works!")
})

// Start server after DB connection
connectDB().then(() => {
  server.listen(process.env.PORT, () => {
    //console.log(`server is running!!! on port ${process.env.PORT}`);
  });
});


