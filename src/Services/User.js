import axios from "axios";

class ApiUser{

    //api get users
    async getAllUsers(){
        return axios.get('http://localhost:8000/api/users');
    }

    //api show user
    async getUser(userId){
        return await axios.get(`http://localhost:8000/api/user/${userId}`)
    }

    //api store user
    async storeUser(data){
        return await axios.post('http://localhost:8000/api/user', data)
    }
    
    //api update user
    async updateUser(data, id){
        return await axios.put(`http://localhost:8000/api/user/${id}`, data)
    }

    //api delete user
    async deleteUser(id){
        return await axios.delete(`http://localhost:8000/api/user/${id}`)
    }

}
export default new ApiUser();