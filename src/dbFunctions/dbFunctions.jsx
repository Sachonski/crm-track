import axios from 'axios'


const fetchQuery = async (query) => {
    const res = await axios.post("https://backend-server-db-4e7fb706df42.herokuapp.com/", {
      query: query,
    });
    console.log(res)
    if (res.data[0]) {
      return res.data
    } else {
      return []
    }
  };

  export default fetchQuery