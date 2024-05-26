let messages = {};

export const getMessages = (req, res) => {
  const { userId, contactId } = req.params;
  const userMessages = messages[userId] || {};
  const contactMessages = userMessages[contactId] || [];
  res.json(contactMessages);
};

export const sendMessage = (req, res) => {
  const { userId, contactId, text } = req.body;
  if (!messages[userId]) {
    messages[userId] = {};
  }
  if (!messages[userId][contactId]) {
    messages[userId][contactId] = [];
  }
  const newMessage = {
    text,
    timestamp: new Date().toLocaleTimeString(),
    sender: userId,
  };
  messages[userId][contactId].push(newMessage);
  res.json(newMessage);
};