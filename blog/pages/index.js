import Head from 'next/head'
import { useEffect } from 'react'
import Layout, { siteTitle } from '../components/Layout'
import utilStyles from '../styles/utils.module.css'
import React, { useState } from 'react';
import { getSortedPostsData } from '../lib/post';
import Link from 'next/link'
import Date from '../components/Date'

//ssr로 바꾸고 싶으면 getServerSideProps로 바꾸면 끝임
export async function getStaticProps() {
//ssg Data가 담겨져 있다.
const allPostsData = getSortedPostsData()
return {
//ssg가 담겨있는 props retrun
props: {
allPostsData,
},
}
}

//CSR로 바꾸는 방법. 
export default function Home() {
const [allPostsData, setAllPostsData] = useState([])
useEffect(()=>{
  //posts에서 response가 오면 json으로 바꿔주고.data가 오면 A
  fetch('/api/posts')
  .then((res) => res.json())
  .then((data) => setAllPostsData(data.allPostsData))
}, [])

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>I love coding 😍</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>

          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
            <Link href={`/posts/${id}`}>
              <a>{title}</a>
            </Link>
            <br />
            <small className={utilStyles.lightText}>
              <Date dateString={date} />
            </small>
          </li>
          ))}
        </ul>
        </section>
    </Layout>
  )
}

//allPostsData를 map으로 돌면서 id key로 주고 title,id(파일이름),date를 준다.
