import axios from "axios";
class Auth {
  // api login
  async login(data) {
    return await axios.post("http://localhost:8000/api/login", data);
  }
  // api logout
  async logout() {
    return await axios.post("http://localhost:8000/api/logout", null);
  }
}
export default new Auth();
