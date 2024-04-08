# React Query devtools
~~~
Sử dụng ở component App
const queryClient = new QueryClient();
<QueryClientProvider client={queryClient}>
  ...
  <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
</QueryClientProvider>
~~~
# Use Query
* config trong useQuery:
  *  retry: 2 - fetch chỉ 2 lần khi bị lỗi 
  *  retryDelay: 2000 - load lại sau 2 giây khi bị error
  *  refetchOnMount: false - tranh fetch lại khi chuyển các component khác và quay lại (trong trang)
  *  refetchOnWindowFocus: true - tranh fetch lại khi chuyển tab và chuyển lại (ngoài trang)
  *  refetchInterval: 2000 - sau khoảng 2 giây là fetch lại
  *  refetchOnReconnect: true - fetch lại nếu đã nhận internet
  *  cacheTime: 2000 - trong cache bị xoá đi trong 2 giây nếu không xài state đó nữa ( ví dụ không ở component listPost nữa )
  *  staleTime: 5000 - data còn mới khoảng 5 giây thành data cũ thì sẽ fetch lại lấy data mới (fresh -> stale)
  *  Lưu ý: (cacheTime > staleTime)
  *  enabled: isClicked - khi isClicked = true thì fetch lại data
  *  onSuccess: () => { console.log('successfully') } - xử lý thông báo khi thành công
  *  onErrror: () => {} - that bai
  *  onSettled: () => {} - giống default finally dù thất bại hay thành công vẫn sẽ chạy
  *  initialData: initialData - khi đang trong loading thì lấy initialData bù vào cho tới khi fetch data thành công và cập nhật initialData
  *  placeholderData: initialData - khác với initialData là data không được lưu trong cache
  *  Lưu ý: ( initialData tự tạo )
  *  select: (data) => {
     console.log('data',data);
     return data.map(item => ({...item,name: item.title })) - custom data và trả về, lúc này listPost sẽ là undefined nếu không được return, nhưng trong cache vẫn là data cũ không thay đổi }
~~~
cách 1:
const {isError,isLoading,data: listPost} = useQuery({queryKey:['posts'],queryFn: fetchAllPost, retry: 2, retryDelay: 1000, retryOnMount: false});
cách 2:
const {isError,isLoading,data: listPost} = useQuery(["posts"], fetchAllPost, { config theo ý mình } )
~~~
# Use InfiniteQuery
* https://tanstack.com/query/v4/docs/framework/react/guides/infinite-queries
# Use Query Client
~~~
const queryClient = useQueryClient();
queryClient.getQueryData(['posts',[1]]); //lay data trong cache được chỉ định
queryClient.getQueriesData() //lay het data trong cache
queryClient.getQueriesData(['posts',[1]]);
~~~
# Use Mutation
~~~
const mutationCreate = useMutation(fetchCreatePost, {onSuccess...}
const handleCreatePost = () => {
  mutationCreate.mutate(inputState);
};
~~~
# Use InvalidateQueries
~~~
refetch query mỗi khi post hoặc put gì đó !!
queryClient.refetchQueries(['posts',[100]]); //refetch không quan tâm nơi nào đang sử dụng
queryClient.invalidateQueries(['posts',[100]]); //chỉ refetch nơi nào có sử dụng
~~~
# Prefetching Query
~~~
Prefetching query => mà mình muốn lấy data từ server để cập nhật vào cache, khi cần sử dụng thì không cần phải đợi
const fetchAllPost = async (page) => {
const res = await getAllPosts(page);
  return {data: res.data, pageTotal: res.pageTotal}
}
useEffect(() => {
  queryClient.prefetchQuery(['posts',1],fetchAllPost)
},[])
~~~
# Cancel Queries
~~~
Cancel Queries nếu không sử dụng
useEffect(() => {
  return () => {
    users?.forEach((userId) => {
      queryClient.cancelQueries(['users',userId])
    })
    queryClient.cancelQueries({queryKey: ['post',id]})
 }
},[id])
~~~
# JWT with Axios
~~~
const instanceAxios = axios.create({baseURL: 'http://localhost:3000'})

instanceAxios.interceptors.request.use((config) => {
  const access_token = 'access_token'
  const decoded = {exp:10} //jwt_decode(access_token)
  const currentTime = new Date()
  
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
~~~
