import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import * as Services from "../services";
import Loading from "../components/Loading";

function ReactPostDetailsPage() {
  const params = useParams();
  const location = useLocation();
  const users = location.state;
  const { id } = params;
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [post, setPost] = useState({});
  const [listUser, setListUser] = useState([]);

  const fetchDetailsPost = async (id) => {
    setIsLoading(true);
    try {
      await Services.getDetailsPost(id).then((res) => {
        if (res?.status === 200) {
          setPost(res.data);
          setIsLoading(false);
          setIsSuccess(true);
        } else {
          setIsError(true);
        }
      });
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.log(error.message);
    }
  };

  const fetchUserDetail = async (id) => {
    setIsLoading(true);
    try {
      await Services.getDetailUser(id).then((res) => {
        if (res?.status === 200) {
          const isExits = listUser.find((item) => item.id === res?.data?.id);
          if (!isExits || !listUser) {
            setListUser((prev) => [...prev, res.data]);
          }
          setIsLoading(false);
          setIsSuccess(true);
        } else {
          setIsError(true);
        }
      });
      setIsLoading(false);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (users) {
      users?.forEach((userId) => {
        fetchUserDetail(userId);
      });
    }
  }, [users]);
  console.log("listUser", listUser);
  useEffect(() => {
    if (id) {
      fetchDetailsPost(id);
    }
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <div>Error...</div>;
  }

  return (
    <div>
      <div>
        <h1>Title: </h1> <span>{post?.title}</span>
      </div>
      <div>
        <h1>Id: </h1> {post?.id}
      </div>
      <div>
        {users.map(userId => {
          return (
            <span>UserID: {userId} </span>
          )
        })}
      </div>
    </div>
  );
}

export default ReactPostDetailsPage;
