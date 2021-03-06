import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Groups from "./dbGroups.js";
import GroupsPeople from "./dbGroupsPeople.js";
import Pusher from "pusher";
import cors from "cors";
import checkAuth from "./Check-Auth.js";

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
mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb+srv://admin:Lxyc9pwKslhPtpPk@cluster0.bm881.mongodb.net/<chatappdb>?retryWrites=true&w=majority",
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.once("open", () => {
  console.log("DB connected");

  const msgCollection = db.collection("messagecontents");
  const groupCollection = db.collection("groups");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        //messages are encrypted client-side.
        group: messageDetails.groupid,
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
});

//API Routes

app.get("/groupspeople/sync", (req, res) => {
  GroupsPeople.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.post("/groupspeople/new", (req, res) => {
  const dbGroupsPeople = req.body;

  GroupsPeople.create(dbGroupsPeople, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/groups/sync", (req, res) => {
  db.collection("groups")
    .aggregate([
      {
        $match: {
          user: req.query.user,
        },
      },
      {
        $lookup: {
          from: "peoplegroups",
          localField: "_id",
          foreignField: "groupid",
          as: "User",
        },
      },
    ])
    .toArray(function (err, data) {
      if (err) throw res.status(500).send(err);
      res.status(201).send(data);
    });
});

app.post("/groups/new", (req, res) => {
  const dbGroup = req.body;

  Groups.create(dbGroup, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/messages/sync", (req, res) => {
  Messages.find({ group: req.query.group }, (err, data) => {
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
