import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQueryPost } from "../hooks/useQueryPost";
import Loading from "../components/Loading";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { getDetailUser, updatePost } from "../services";

function ReactQueryDetailsPage() {
  const { id } = useParams();
  const { state: users } = useLocation();
  const [inputState, setInputState] = useState({
    title: '',
    body: '',
  });
  //xu ly user seen
  const fetchDetailsUser = async (id) => {
    const res = await getDetailUser(id);
    return res.data;
  };

  const fetchUpdatePost = async (dataUpdate) => {
    const { id, data } = dataUpdate;
    console.log('id,data', {id,data})
    const res = await updatePost(id,data);
    return res.data;
  };

  

  const queries = useQueries({
    queries: users?.map((userId) => {
      return {
        queryKey: ["user", userId],
        queryFn: () => fetchDetailsUser(userId),
        refetchOnWindowFocus: false 
      };
    }),
  });

  const { data, isLoading, isError } = useQueryPost(id, { enabled: !!id}); //khi nào có param id mới call

  const handleOnChangeInput = (event) => {
    const { name, value } = event.target;
    setInputState({
      ...inputState,
      [name]: value,
    });
  };
  //mutation
  const queryClient = useQueryClient();

  const mutationUpdatePost = useMutation(fetchUpdatePost, {
    onSuccess: (postUpdated) => {
      // queryClient.refetchQueries(['posts',[100]]); //refetch không quan tâm nơi nào đang sử dụng
      // queryClient.invalidateQueries(['posts',[100]]); //chỉ refetch nơi nào có sử dụng
      queryClient.setQueryData(['post',id], postUpdated)
      setInputState({
        title: "",
        body: ""
      })
    },
  });

  // Cancel Queries nếu không sử dụng
  // useEffect(() => {
  //   return () => {
  //     users?.forEach((userId) => {
  //       queryClient.cancelQueries(['users',userId])
  //     })
  //     queryClient.cancelQueries({queryKey: ['post',id]})
  //   }
  // },[id])

  const handleUpdatePost = () => {
    mutationUpdatePost.mutate({ id, data: inputState });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Error</div>;
  }
  return (
    <div>
      <div>
        <h1>Title: </h1>
        <input value={inputState?.title} name="title" onChange={handleOnChangeInput} />
      </div>
      <div>
        <h1>Id: </h1>
        <input value={inputState?.body} name="body" onChange={handleOnChangeInput} />
      </div>
      <button onClick={handleUpdatePost}>Update Post</button>
      <div>
        <h1>Title: </h1> <span>{data?.title}</span>
      </div>
      <div>
        <h1>Id: </h1> {data?.id}
      </div>
      <div>
        {queries?.map((user) => {
          return <h4 key={user?.data.id}>User Seen: {user?.data.name}</h4>;
        })}
      </div>
    </div>
  );
}

export default ReactQueryDetailsPage;
