import http from '../utils/http/http.js'

let commonUrl = '/dialogue/fileid';
const getDocumentList = (data) => {
    return http.post(commonUrl + "/page", data);
};
const getDocumentTypeList = (data) => {
    return http.get(commonUrl + "/type", data);
};
const getDocumentById = (data) => {
    return http.get(commonUrl + "/get", data);
};
const editDocument = (data) => {
    return http.put(commonUrl + "/update", data);
};
const addDocument = (data) => {
    return http.post(commonUrl + "/create", data);
};
const addMulDocument = (data) => {
    return http.post(commonUrl + "/create-list", data);
};
const deleteDocument = (data) => { 
    return http.del(commonUrl + "/delete", data);
};
const deleteMulDocument = (data) => { 
    return http.del(commonUrl + "/delete-list", data);
};
export default {
    getDocumentList, 
    getDocumentTypeList,
    editDocument, 
    deleteDocument, 
    addDocument,
    addMulDocument,
    deleteMulDocument,
    getDocumentById
}