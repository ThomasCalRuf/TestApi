const axios = require('axios');

const baseUrl = 'https://dummyjson.com';

exports.getRandomText = async () => {
    let randomId = Math.floor(Math.random()* 100);

    let response = await axios.get(`${baseUrl}/posts/${randomId}`);

    return response.data;
}

// exports.getRandomText = () =>{
//     return new Promise((resolve, reject)=>{
//         let randomId = Math.floor(Math.random()* 100);
//         axios.get(`${baseUrl}/posts/${randomId}`).then((result)=>{
//             resolve(result.data);
//         })
//         .catch((error)=>{
//             reject(error);
//         })
//     })
// }