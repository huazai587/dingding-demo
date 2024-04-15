import http from '../utils/http/http.js'

const login = (data) => {
    return http.post("/system/auth/login", data);
};
const uploadFile = (data) => {
    return http.post("/infra/file/upload", data);
};
export default {
    login,uploadFile
}