import axios from 'axios';

class Message {

     async getMessagesWithUser(id){
        return await axios.get(`http://localhost:8000/api/message/${id}`); 
    }

    async storeMessage(data){
        return await axios.post('http://localhost:8000/api/message/',data); 
    }
    async getConversatiion(id){
        return await axios.get(`http://localhost:8000/api/conversationId/${id}`);
    }
}

export default new Message();