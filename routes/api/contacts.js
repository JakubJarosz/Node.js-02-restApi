
const express = require("express");
const router = express.Router();
// const contactFunc = require("../../models/contacts");
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:srmn1234@cluster0.ajorxrm.mongodb.net/node-03"
).then(() => {
  console.log("Database connection successful");
}).catch((err) => {
  console.log("something went wrong", err);
  process.exit(1);
});

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const contacts = mongoose.model("contacts", contactSchema);

router.get("/", async (req, res, next) => {
  contacts.find({})
    .then((data) => {
    res.status(200).send(data)
    }).catch((err) => {
      res.status(500).send(err)
  })
});

router.get("/:contactId", async (req, res, next) => {
  contacts.findById(req.params.contactId).then((data) => {
    if (!data) {
      return res.status(404).json("Id not found");
    }   
    res.send(data)
  }).catch((err) => {
      res.status(500).send(err)
  })
});

router.post("/", async (req, res, next) => {
  const cont = new contacts(req.body);
  cont
    .save()
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((er) => {
      res.status(400).send(er);
    });
});

router.delete("/:contactId", async (req, res, next) => {
  contacts.findByIdAndDelete(req.params.contactId).then((data) => {
    if (!data) {
      return res.status(404).json("Id not found")
    }
    res.send(data)
  }).catch((err) => {
    res.status(500).send(err)
  })
});

router.put("/:contactId", async (req, res, next) => {
  contacts.findByIdAndUpdate(req.params.contactId, req.body, { new: true }).then((data) => {
    if (!data) {
      return res.status(404).json("Id not found")
    }
    res.send(data)
  }).catch((err) => {
    res.status(500).send(err)
  })
});

router.patch("/:contactId", async (req, res, next) => {
  contacts
    .findByIdAndUpdate(req.params.contactId, req.body, { new: true })
    .then((data) => {
      if (!req.body) {
        return res.status(400).json("missing field favorite");
      }
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});
module.exports = router;
