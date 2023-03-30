import Layout from '../../components/Layout'
import { getAllPostIds, getPostData } from '../../lib/post';
import { useRouter } from 'next/router';
import utilStyles from '../../styles/utils.module.css'


//getStaticPaths안에서 배열을 주고,fallback은 false를 줬다.
//paths를 통해서 목록을 가져왔다.
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

//실제 데이터를 가져와서 여기에 그렸다.
export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export default function Post({ postData }) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return (
    <Layout>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <br />
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  )
}
