import { useQuery } from "@tanstack/react-query";
import { getAllPosts } from "../services";

const fetchAllPost = async (page) => {
  const res = await getAllPosts(page);
  return {data: res.data, pageTotal: res.pageTotal};
};

export const useQueryPosts = (page,{...rests}) => {
    return useQuery(["posts",[page]],() => fetchAllPost(page), rests)
}


