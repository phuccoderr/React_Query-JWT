import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getAllPosts } from "../services";
const HomePage = () => {
  const queryClient = useQueryClient();
  console.log("queryClient", queryClient.getQueryData(['posts',[1]])); //lay data trong cache được chỉ định
  console.log('queryClient Full',queryClient.getQueriesData()) //lay het data trong cache
  console.log('queryClient FUll for ...', queryClient.getQueriesData(['posts',[1]]))

  const handleClear = () => {
    // queryClient.removeQueries(['posts',[1]]) // xoa key trong cache
    queryClient.resetQueries() // dua key trong cache thanh null
  }

  //Prefetching query => mà mình muốn lấy data từ server để cập nhật vào cache, khi cần sử dụng thì không cần phải đợi
  // const fetchAllPost = async (page) => {
  //   const res = await getAllPosts(page);
  //   return {data: res.data, pageTotal: res.pageTotal}
  // }
  // useEffect(() => {
  //   queryClient.prefetchQuery(['posts',1],fetchAllPost)
  // },[])


  return (
    <div>
      <h1>HomePage</h1>
      <button onClick={handleClear}>Clear</button>
    </div>
  );
};

export default HomePage;
