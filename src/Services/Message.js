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
  async deleteConversation(userId) {
    return await axios.delete(`http://localhost:8000/api/message/${userId}`);
  }
}

export default new Message();
