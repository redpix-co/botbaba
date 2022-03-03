import axios from 'axios';

// Base Url
const baseUrl = "https://reqres.in/api";


export const userService = {
    getUser,
    NewUser,
    UserUpdate,
    UserDelete,
    // getUserData
};


// Getdata Query
function getUser() {
    return axios.get(baseUrl + "/users/?page=1").then(handleResponse);
}

// Page Wise fetch user
// function getUserData(query) {
//     return axios.get(baseUrl + "/users/?per_page=" + query.pageSize + "&page=" + (query.page + 1)).then(handleResponse);
// }

// New User Query
function NewUser(newUser) {
    return axios.post(baseUrl + "/users/" + newUser).then(handleResponse);
}

//  User Update Query
function UserUpdate(id, user) {
    return axios.patch(baseUrl + "/users/" + id, user).then(handleResponse);
}

// User Delete Query
function UserDelete(id) {
    return axios.delete(baseUrl + "/users/" + id).then(handleResponse);
}





// Handle Responce
function handleResponse(response) {
    return response.data;
}