import axios from "axios";

class Message {
  async getMessagesWithUser(id) {
    return await axios.get(`http://localhost:8000/api/message/${id}`);
  }

  async storeMessage(data) {
    return await axios.post("http://localhost:8000/api/message/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async getConversatiion(id) {
    return await axios.get(`http://localhost:8000/api/conversationId/${id}`);
  }

  async typingMessage(data) {
    return await axios.post(
     'http://localhost:8000/api/typing-status', data
    );
  }

  async deleteConversation(userId) {
    return await axios.delete(
      `http://localhost:8000/api/delete/conversation/${userId}`
    );
  }

  async deleteMessage(id) {
    return await axios.delete(
      `http://localhost:8000/api/message/${id}`
    );
  }
}

export default new Message();
