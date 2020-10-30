import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";

//App config
const app = express();
const port = process.env.PORT || 9000;

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

//DB config
const connection_url =
  "mongodb+srv://admin:Lxyc9pwKslhPtpPk@cluster0.bm881.mongodb.net/<chatappdb>?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
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

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        //DO NOT USE THIS IN PRODUCTION ENVIRONMENT MESSAGES ARE NOT ENCRYPTED.
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });
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

// password db: Lxyc9pwKslhPtpPk
if (process.env.NODE_ENV === "production") {
  app.use(express.static("../chat-app/build"));
}
