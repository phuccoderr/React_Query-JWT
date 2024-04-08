import axios from "axios";

const instanceAxios = axios.create({baseURL: 'http://localhost:3000'})

instanceAxios.interceptors.request.use((config) => {
  console.log({config});
  const access_token = 'access_token'
  const decoded = {exp:10} //jwt_decode(access_token)
  const currentTime = new Date()
  console.log(currentTime / 1000);
  const  decodedRefreshToken = {exp: 365} //jwt_decode(refreshToken)
  if (decoded.exp < (currentTime / 1000)) {
    if (decodedRefreshToken.exp < (currentTime / 1000)) {
      window.location.href = '/login'
    } else {
      access_token = 'new access_token' //call api để nhận access token mới từ refresh_token
    }
  } 
  config.headers.Authorization= `Bearer ${access_token}`
  return config;
})

const getDetailUser = async (idUser) => {
  const res = await axios.get(`http://localhost:3001/users/${idUser}`)
  return {
    status: res?.status,
    statusText: res?.statusText,
    data: res?.data
  }
}

const getAllPosts = async (limit = 100, pageNumber = 1) => {
  try {
    const res = await instanceAxios.get(`http://localhost:3001/posts?_limit=${limit}&_page=${pageNumber}`);
    const resTotal = 14;
    return {
      status: res?.status,
      statusText: res.statusText,
      data: res?.data?.map((post) => {
        return {
          ...post,
          body:
            post?.body?.substring(0, 50) +
            (post?.body?.length > 50 ? "..." : ""),
        };
      }),
      pageTotal: resTotal / limit
    };
  } catch (error) {
    console.log(error)
  }
};

const getDetailsPost = async (idPost) => {
  const res = await axios.get(`http://localhost:3001/posts/${idPost}`);
  return {
    status: res?.status,
    statusText: res.statusText,
    data: res?.data,
  };
};

const createPost = async (data) => {
  console.log(data)
  const res = await axios.post(`http://localhost:3001/posts`,data);
  return {
    status: res?.status,
    statusText: res.statusText,
    data: res?.data
  }
}

const deletePost = async (idPost) => {
  const res = await axios.delete(`http://localhost:3001/posts/${idPost}`);
  return {
    status: res?.status,
    statusText: res?.statusText,
    data: res?.data
  };
};

const updatePost = async (idPost, data) => {
  const res = await axios.patch(`http://localhost:3001/posts/${idPost}`, data);
  return {
    status: res?.status,
    statusText: res.statusText,
    data: res?.data,
  };
};

export { getAllPosts, getDetailsPost, deletePost, updatePost,getDetailUser, createPost };
