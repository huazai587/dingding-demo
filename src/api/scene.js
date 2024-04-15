import http from '../utils/http/http.js'

let commonUrl = '/dialogue/conditions';
const getSceneList = (data) => {
    return http.get(commonUrl + "/info-list", data);
};
const editScene = (data) => {
    return http.put(commonUrl + "/update", data);
};
const addScene = (data) => {
    return http.post(commonUrl + "/create", data);
};
const deleteScene = (data) => { 
    return http.del(commonUrl + "/delete", data);
};
export default {
    getSceneList, editScene, deleteScene, addScene
}