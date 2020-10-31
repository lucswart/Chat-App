import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";

//App config
const app = express();
const port = process.env.PORT || 5000;

const pusher = new Pusher({
  appId: "1099284",
  key: "d061d5c4829b3f6e3b32",
  secret: "449ce2b70cfa9ca2f2ec",
  cluster: "eu",
  useTLS: true,
});

//Middleware
app.use(express.json());
app.use(cors());

//DB confg
mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("DB connected");

  const msgCollection = db.collection("messagecontents");
  const groupCollection = db.collection("groups");
  const changeStream = msgCollection.watch();
});

//API Routes

app.get("/groups/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.post("/groups/new", (req, res) => {
  const dbGroup = req.body;

  Messages.create(dbGroup, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

//Listen
app.listen(port, () => console.log(`Listening on localhost: ${port}`));

// add middleware
app.use(express.static("./chat-app/build"));

// password db: Lxyc9pwKslhPtpPk
