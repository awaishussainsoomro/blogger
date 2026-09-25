import { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from "react-router";

function EditPost() {
  const [ post, setPost ] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((dbPost) => {
        if (dbPost) {
          setPost(dbPost);
        }
      });
    } else {
      navigate("/");
    }
  }, [slug, navigate, setPost, post]);

  return post ? (
    <div className="py-8">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  ) : null;
}

export default EditPost;
