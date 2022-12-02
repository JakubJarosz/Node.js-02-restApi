
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;
const User = require("../../schemas/user");


const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      return res.status(401).json({
        Status: "401 Unauthorized",
        ContentType: "application/json",
        ResponseBody: {
          message: "Not authorized",
        },
      });
    }
    req.user = user;
    next()
  })(req, res, next);
}


mongoose.connect(
  "mongodb+srv://admin:srmn1234@cluster0.ajorxrm.mongodb.net/node-03"
).then(() => {
  console.log("Database connection successful");
}).catch((err) => {
  console.log("something went wrong", err);
  process.exit(1);
});



const contactSchema = new mongoose.Schema({
  owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
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


router.get("/api/contacts", auth, async (req, res, next) => {
  contacts
    .find({})
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/api/contacts/:contactId", auth, async (req, res, next) => {
  contacts
    .findById(req.params.contactId)
    .then((data) => {
      if (!data) {
        return res.status(404).json("Id not found");
      }
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.post("/api/contacts", auth, async (req, res, next) => {
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

router.delete("/api/contacts/:contactId", auth, async (req, res, next) => {
  contacts
    .findByIdAndDelete(req.params.contactId)
    .then((data) => {
      if (!data) {
        return res.status(404).json("Id not found");
      }
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.put("/api/contacts/:contactId", auth, async (req, res, next) => {
  contacts
    .findByIdAndUpdate(req.params.contactId, req.body, { new: true })
    .then((data) => {
      if (!data) {
        return res.status(404).json("Id not found");
      }
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.patch("/api/contacts/:contactId", auth, async (req, res, next) => {
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

// REGISTRATION, LOGIN, LOGOUT, CURRENT_LOGGED_USER

router.post("/users/signup", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      Status: '409 Conflict',
      ContentType: "application/json",
      ResponseBody: {
        "messege": "Email in use",
      } 
      
    })
  }
  try {
    const newUser = new User({ email });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      Status: "201 Created",
      ContentType: "application/json",
      ResponseBody: {
        user: {
          email: email,
          subscription: "starter",
        },
      },
    });
  } catch {
    res.status(400).json({
      Status: "400 Bad Request",
      ContentType: "application/json",
      ResponseBody: "Błąd z Joi lub innej biblioteki walidacji",
    });
  }
});

router.post("/users/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.validPassword(password)) {
    return res.status(401).json({
      Status: "401 Unauthorized",
      ResponseBody: {
        message: "Email or password is wrong",
      },
    });
  }
  try {
   
    const payload = {
      id: user._id,
      emial: user.email,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    res.status(200).json({
      Status: "200 OK",
      ContentType: "application/json",
      ResponseBody: {
        "token": token,
        "user": {
          "email": email,
          "subscription": "starter"
        }
      }
    })

    await User.updateOne({email: email}, {$set: {token: token}})
  } catch {
     res.status(400).json({
       Status: "400 Bad Request",
       ContentType: "application/json",
       ResponseBody: "Błąd z Joi lub innej biblioteki walidacji",
     });
 }

});

router.get("/users/logout", auth, async (req, res, next) => {
  await User.updateOne({ _id: req.user._id }, { $set: { token: null } });
  return res.status(204).json({
    Status: "204 No Content"
  })
});

router.get("/users/current", auth, async (req, res, next) => {
  return res.status(200).json({
    Status: "200 OK",
    ContentType: "application/json",
    ResponseBody: {
      email: req.user.email,
      subscription: "starter",
    },
  });
});
module.exports = router;
