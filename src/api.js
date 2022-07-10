import axios from 'axios';

export default axios.create({
  baseURL: `http://localhost:8080/api/`,
  // baseURL: `https://spring-boot-rest-api-nas.herokuapp.com/api/`,
  // baseURL: `https://webhook-dialog-flow-spring-boo.herokuapp.com/api/`,
});
