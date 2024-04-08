import { useQuery } from "@tanstack/react-query";
import { getDetailsPost } from "../services";

const fetchDetaiPost = async ({queryKey}) => {
  // console.log('queryKey',queryKey); // ['post',1]
  const res = await getDetailsPost(queryKey[1]);
  return res.data;
};

export const useQueryPost = (id, {...rests}) => {
    return useQuery(["post",id], fetchDetaiPost, rests)
}


