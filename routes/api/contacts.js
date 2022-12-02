const uniqid = require("uniqid");
const express = require("express");
const router = express.Router();
const contactFunc = require("../../models/contacts");
const Joi = require("joi");


router.get("/", async (req, res, next) => {
  const contactList = await contactFunc.listContacts();
  res.status(200);
  res.json({
    status: "success",
    code: 200,
    data: {
      contactList,
    },
  });
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const allContacts = await contactFunc.listContacts();
  const contact = await contactFunc.getContactById(contactId);
  if (allContacts.map((el) => el.id).includes(contactId)) {
     res.status(200)
      res.json({
        status: "success",
        code: 200,
        data: { contact },
      });
  } else {
    res.status(404);
    res.json("Id: Not found")
  }
});

router.post("/", async (req, res, next) => {
  const { name, email, phone } = req.body;
  const schema = Joi.object({
    name: Joi.string().min(1),
    email: Joi.string().min(1),
    phone: Joi.number().min(1),
  });
  let { error, value } = schema.validate({ name: name, email: email, phone: phone });
  const newContact = {
    id: uniqid(),
    name: name,
    email: email,
    phone: phone,
  };
  if (error !== undefined) {
    res.status(400);
    res.json(error);
  } else {
      res.status(201).json({
        status: "success",
        code: 201,
        data: { newContact },
      });
      return contactFunc.addContact(newContact);
  }
});

router.delete("/:contactId", async (req, res, next) => {
 const { contactId } = req.params;
 const allContacts = await contactFunc.listContacts();
 if (allContacts.map((el) => el.id).includes(contactId)) {
   res.status(200);
   res.json("contact deleted");
   await contactFunc.removeContact(contactId);
 } else {
   res.status(404);
   res.json("Id: Not found");
 }
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
    const schema = Joi.object({
      name: Joi.string().min(1),
      email: Joi.string().min(1),
      phone: Joi.number().min(1),
    });
  let { error, value } = schema.validate({
    name: name,
    email: email,
    phone: phone,
  });
    if (error !== undefined) {
      res.status(400);
      res.json(error);
    } else if (error === undefined) {
      res.status(200)
      res.json(await contactFunc.updateContact(contactId, { name, email, phone }))
    } else {
      res.status(404);
      res.json("Not found");
    }
});

module.exports = router;
