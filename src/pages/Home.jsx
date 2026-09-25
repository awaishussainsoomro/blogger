import { useEffect, useState } from 'react'
import appwriteService from '../appwrite/config'
import { Container, PostCard } from '../components'
import { useSelector } from 'react-redux'

function Home() {
    const [posts, setPosts] = useState([])
    // 1. Grab current logged-in status from Redux store
    const authStatus = useSelector((state) => state.auth.status)

    useEffect(() => {
        // 2. ONLY fetch posts if the user is actually logged in!
        if (authStatus) {
            appwriteService.getPosts().then((posts) => {
                if (posts) {
                    setPosts(posts.documents || posts.rows)
                }
            })
        }
    }, [authStatus])

    // 3. Fallback UI when logged out or no posts exist
    if (!authStatus || posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                {authStatus ? "No posts found" : "Login to read posts"}
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home