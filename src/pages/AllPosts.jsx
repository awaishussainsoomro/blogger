import { useEffect } from 'react'
import appwriteService from '../appwrite/config'
import { Container, PostCard } from '../components'
import { useDispatch, useSelector} from 'react-redux'
import { setPosts } from '../store/postsSlice'

function AllPosts() {

    const dispatch = useDispatch()
    const posts = useSelector((state) => (state.posts.posts))

    useEffect(() => {
        appwriteService.getPosts().then((post) => {
            if (post) {
                dispatch(setPosts(post.rows))
            }
        })
    }, [dispatch])

    if (posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                No posts found
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

  return (
    <div className='w-full, py-8'>
        <Container>
            <div className='flex flex-wrap'>
                {posts.map((post) => (
                    <div key={post.$id} className='p-2 w-1/4'>
                        <PostCard {...post}/>
                    </div>
                ))}
            </div>
        </Container>
    </div>
  )
}

export default AllPosts