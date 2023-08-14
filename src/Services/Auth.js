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
  // get user id logged
    // api logout
    async getUserIdLogged() {
      return await axios.get("http://localhost:8000/api/user/logged");
    }
}
export default new Auth();
