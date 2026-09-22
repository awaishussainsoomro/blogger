import {useCallback, useEffect} from 'react'
import { useForm, useWatch } from 'react-hook-form'
import {Button, Input, Select, RTE} from '../index'
import appwriteService from '../../appwrite/config'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'


function PostForm({post}) {

    const {register, handleSubmit, control, setValue, getValues} = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.slug || '',
            content: post?.content || '',
            status: post?.status || "active"
        }
    });

    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)

    const submit = async (data) => {
      if (post) {
        const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
        
        if (file) {
          await appwriteService.deleteFile(post.featuredImage)
        }

        const dbPost = await appwriteService.updatePost(post.$id, { 
          ...data,
          featuredImage: file ? file.$id : undefined
        })

        if (dbPost) navigate(`/post/${dbPost.$id}`)

      } else {
        const file = post.image ? await appwriteService.uploadFile(data[0]) : null;

        if (file) {
          const fileID = file.$id
          data.featuredImage = fileID

          const dbPost = await appwriteService.createPost({...data, userId: userData.$id})

          if (dbPost) navigate(`/post/${dbPost.$id}`)
        }
      }
    };

    const titleValue = useWatch({
      control,
      name: "title"
    })

    const slugTransform = useCallback((value) => {
      if (value && typeof value === "string") {
        return value
        .trim()
        .toLowerCase()
        .replace(/^[a-zA-Z\d\s]+/g, '-')
        .replace(/\s/g, '-')
      }

      return ''
    }, [])

    useEffect(() => {
      if (titleValue) {
        setValue('slug', slugTransform(titleValue), {shouldValidate: true})
      }
      
    }, [titleValue, slugTransform, setValue])

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
  )
}

export default PostForm