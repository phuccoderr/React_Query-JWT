import React, { useState } from "react";
import Loading from "../components/Loading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, deletePost, getAllPosts } from "../services";
import { useQueryPosts } from "../hooks/useQueryPosts";
import { Link, useNavigate } from "react-router-dom";

const ReactQueryPostPage = () => {
  const [isClicked, setIsCliecked] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  const navigate = useNavigate();

  const [inputState, setInputState] = useState({
    title: "",
    body: "",
  });

  const handleNavigate = async (idUser) => {
    navigate(`/react-query/${idUser}`, {
      state: [2, 4],
    });
  };

  const initialData = [
    {
      userId: 0,
      title: "",
    },
  ];

  //mutation
  const queryClient = useQueryClient();

  const fetchCreatePost = async (post) => {
    const res = await createPost(post);
    console.log(res);
    return res.data;
  };

  const fetchDeletePost = async (id) => {
    const res = await deletePost(id);
    return res.data;
  };

  const mutationCreate = useMutation(fetchCreatePost, {
    onSuccess: (post) => {
      // queryClient.refetchQueries(['posts',pageNumber]); // fetch lai list api
      queryClient.setQueryData(["posts", [100]], (oldData) => {
        return { ...oldData, data: [...oldData.data, post] };
      });
      setInputState({
        title: "",
        body: "",
      });
    },
  });

  const mutationDelete = useMutation(fetchDeletePost, {
    onSuccess: (post) => {
      // queryClient.refetchQueries(['posts',pageNumber]); // fetch lai list api
      queryClient.setQueryData(["posts", [100]], (oldData) => {
        return {...oldData, data: oldData.data.filter((item) => item.id !== post.id)}
      });
      setInputState({
        title: "",
        body: "",
      });
    },
  });

  // const fetchAllPost = async () => {
  //   const res = await getAllPosts();
  //   setIsCliecked(false)
  //   return res.data;
  // };

  // const { isError,isLoading,data: listPost} = useQuery({queryKey:['posts'],queryFn: fetchAllPost, retry: 2, retryDelay: 1000, retryOnMount: false});

  // const {
  //   isError,
  //   isLoading,
  //   data: listPost,
  // } = useQuery(["posts"], fetchAllPost, {

  //   // retry: 2, // fetch chỉ 2 lần khi bị lỗi
  //   // retryDelay: 2000, // load lại sau 2 giây khi bị error
  //   // refetchOnMount: false, //tranh fetch lại khi chuyển các component khác và quay lại (trong trang)
  //   // refetchOnWindowFocus: true, //tranh fetch lại khi chuyển tab và chuyển lại (ngoài trang)
  //   // refetchInterval: 2000 //sau khoảng 2 giây là fetch lại
  //   // refetchOnReconnect: true //fetch lại nếu đã nhận internet

  //   // cacheTime: 2000 //state trong cache bị xoá đi trong 2 giây nếu không xài state đó nữa ( ví dụ không ở component listPost nữa )
  //   // staleTime: 5000 //data còn mới khoảng 5 giây thành data cũ thì sẽ fetch lại lấy data mới (fresh -> stale)
  //   // (cacheTime > staleTime)

  //   // enabled: isClicked // khi isClicked = true thì fetch lại data

  //   // onSuccess: () => {
  //   //   console.log('successfully')
  //   // } xử lý thông báo khi success
  //   // onErrror: () => {} // that bai
  //   // onSettled: () => {} // giống default finally dù thất bại hay thành công vẫn sẽ chạy

  //   // initialData: initialData // khi đang trong loading thì lấy initialData bù vào cho tới khi fetch data thành công và cập nhật initialData
  //   // placeholderData: initialData // khác với initialData là data không được lưu trong cache

  //   select: (data) => {
  //     console.log('data',data);
  //     return data.map(item => ({
  //       ...item,
  //       name: item.title
  //     })) //custom data và trả về, lúc này listPost sẽ là undefined nếu không được return, nhưng trong cache vẫn là data cũ không thay đổi
  //   }
  // });

  const {
    isError,
    isLoading,
    data: listPost,
  } = useQueryPosts(100, {
    select: (data) => {
      return data?.data?.map((item) => ({
        ...item,
        name: item.title,
      }));
    },
  });

  const handleClicked = () => {
    setIsCliecked(true);
  };

  const handleOnChangeInput = (event) => {
    const { name, value } = event.target;
    setInputState({
      ...inputState,
      [name]: value,
    });
  };
  //create post
  const handleCreatePost = () => {
    mutationCreate.mutate(inputState);
  };
  //delete post
  const handleDeletePost = (id) => {
    mutationDelete.mutate(id);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <h1>Error</h1>;
  }
  return (
    <div className="content">
      <div>
        <label>Title</label>
        <input
          value={inputState.title}
          onChange={handleOnChangeInput}
          name="title"
        />
      </div>
      <div>
        <label>Body</label>
        <input
          value={inputState.body}
          onChange={handleOnChangeInput}
          name="body"
        />
      </div>
      <button onClick={handleCreatePost}>Post</button>
      <h1>ReactQueryPostPage</h1>
      <button onClick={handleClicked}>Click</button>
      {listPost?.map((post) => {
        return (
          // <div className="post__name" key={post.id}>
          //   {/* {post.title} */}
          //   {post.name}
          // </div>
          // <Link to={`/react-query/${post.id}`} key={post.id}>
          //   {post.name}
          // </Link>
          <div className="wrapper-item" key={post.id}>
            <div onClick={() => handleNavigate(post.id)}>{post.title}</div>
            <div onClick={() => handleDeletePost(post.id)}>X</div>
          </div>
        );
      })}
      <div className="paginated">
        <button
          onClick={() => setPageNumber((prev) => prev - 1)}
          disabled={pageNumber < 2}
        >
          Previous Page
        </button>
        <h4>Current page: {pageNumber}</h4>
        <button
          onClick={() => setPageNumber((prev) => prev + 1)}
          disabled={pageNumber > 7}
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default ReactQueryPostPage;
