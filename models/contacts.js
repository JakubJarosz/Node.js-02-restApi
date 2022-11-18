const fs = require("fs").promises;


const listContacts = async () => {
  const dane = fs
    .readFile(require.resolve("../models/contacts.json"))
    .then((data) => {
      return JSON.parse(data);
    })
    .catch((err) => console.log(err));
  return dane;
};

const getContactById = async (contactId) => {
  const data = fs
    .readFile(require.resolve("../models/contacts.json"))
    .then((data) => {
      const contact = JSON.parse(data).filter((el) => el.id == contactId);
      return contact;
    })
    .catch((err) => console.log(err));
  return data;
};

const removeContact = async (contactId) => {
  const data = fs
    .readFile(require.resolve("../models/contacts.json"))
    .then((data) => {
      const contact = JSON.parse(data).filter((el) => el.id != contactId);
      fs.writeFile(
        require.resolve("../models/contacts.json"),
        JSON.stringify(contact)
      );
    })
    .catch((err) => console.log(err));
  return data;
};

const addContact = async (body) => {
  const dane = fs
    .readFile(require.resolve("../models/contacts.json"))
    .then((data) => {
      const contacts = JSON.parse(data);
      contacts.push(body);
      fs.writeFile(
        require.resolve("../models/contacts.json"),
        JSON.stringify(contacts)
      );
    })
    .catch((err) => console.log(err));
  return dane;
};

const updateContact = async (contactId, body) => {
  const dane = fs
    .readFile(require.resolve("../models/contacts.json"))
    .then((data) => {
      const updData = JSON.parse(data).map((el) =>
        el.id == contactId
          ? { ...el, name: body.name, email: body.email, phone: body.phone }
          : el
      );
      fs.writeFile(
        require.resolve("../models/contacts.json"),
        JSON.stringify(updData)
      );
      return updData
    })
    .catch((err) => console.log(err));
  return dane;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
