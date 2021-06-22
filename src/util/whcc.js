import axios from 'axios';
export const zhzx = {
    getKey: data => axios.get('http://25.95.160.103:9098/api/v1/query?query=${data}').then(res=>res).catch(err=>err)
};
