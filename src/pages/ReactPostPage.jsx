import React, { useEffect, useState } from 'react'
import * as Servives from '../services/index'
import Loading from '../components/Loading';
import { Link, useNavigate } from 'react-router-dom';

const ReactPostPage = () => {
  const [listPost, setListPost] = useState([])
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber,setPageNumber] = useState(1);

  const [inputState,setInputState] = useState({
    title: '',
    body: ''
  })

  const fetchAllPost = async (pageNumber) => {
    setIsLoading(true)
    try {
      Servives.getAllPosts(2,pageNumber).then(res => {
        if(res?.status === 200) {
          setListPost(res.data)
          setIsSuccess(true)
        }else {
          setIsError(true)
        }
      setIsLoading(false)
      })
    } catch (error) {
      setIsError(true)
      setIsLoading(false)
    }
  }
  const navigate = useNavigate()
  const handleNavigate = async (idUser) => {
    navigate(`/react/${idUser}`, {
      state: [2,4]
    })
  }

  useEffect(() => {
    fetchAllPost(pageNumber)
  }, [pageNumber])

  if(isLoading) {
    return <Loading />
  }

  if(isError) {
    return <h1>Error</h1>
  }

  const handleOnChangeInput = (event) => {
    const {name, value} = event.target;
    setInputState({
      ...inputState,
      [name]: value
    })
  }

  const handleCreatePost = () => {
    console.log(inputState);
  }


  return (
    <div className='content'>
      <div>
        <label>Title</label>
        <input value={inputState.title} onChange={handleOnChangeInput} name='title' />
      </div>
      <div>
        <label>Body</label>
        <input value={inputState.body} onChange={handleOnChangeInput} name='body' />
      </div>
      <button onClick={handleCreatePost}>Post</button>
      <h1>ReactPostPage</h1>
        {listPost?.map((post) => {
          // return (
          //   // <div className='post__name' key={post.id}>{post.title}</div>
          //   <Link to={`/react/${post.id}`} key={post.id}>{post.title}</Link>
          // )
          return (
            <div key={post.id} onClick={() => handleNavigate(post.id)}>{post.title}</div>
          )
        })}
      <div className='paginated'>
        <button onClick={() => setPageNumber(prev => prev - 1)} disabled={pageNumber < 2}>Previous Page</button>
        <h4>Current page: {pageNumber}</h4>
        <button onClick={() => setPageNumber(prev => prev + 1)} disabled={pageNumber > 7}>Next Page</button>
      </div>
    </div>
  )
}

export default ReactPostPage