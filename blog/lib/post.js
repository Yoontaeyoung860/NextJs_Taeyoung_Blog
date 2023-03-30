import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark'
import html from 'remark-html'

//Service가 돌고 있는 root..즉 blog에 있는,'posts' 파일(md file저장 해놓은 곳)
const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData()/*정렬된 데이터를 가져옴*/ {
  // Get file names under /posts
  //fs는 파일 시스템을 읽어오는 node.js의 라이브러리다.
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    // .md를 제거하면 pre-rendering ssg-ssr만 남고

    //그것을 id로 삼는다.
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    //fileName은 여전히 md가 있다.
    //fullPath는 root에서 pre-rendering.md가 만들어질거고
    const fullPath = path.join(postsDirectory, fileName);
    //직접 utf-8형식으로 읽어서 fileContents에 담는다.
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    //담고난 뒤엔 -으로 감싸진 부분만 해석 하기 위해  grey-matter 설치했다.

    //matter로 감싸주면 matterResult로 metadata를 다 읽어낸다.
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    //id는 파일 이름이었고, 그것을 빼내주는 것이 getSortedPostsData 함수다.
    return {
      id,
      ...matterResult.data,
    };
  });
  // Sort posts by date
  //날짜가 느린것을 앞에보내고 날짜가 빠른 것을 앞에 보내는 것. 즉 최신 순
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
  
    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/, ''),
        },
      };
    });
  }

//id를 직접줘서 해당 슬러그 파일만 읽는 것..
  export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
  
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
   
    const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
  const contentHtml = processedContent.toString()

    // Combine the data with the id
    return {
      id,
      contentHtml,
      ...matterResult.data,
    };
  }

  export async function createPost({id, title, date, content}) {
    const fullPath = path.join(postsDirectory, `${id}.md`)

    const data = `---
    title: '${title}'
    date: '${date}'
    --- 

    ${content}`

    fs.writeFileSync(fullPath. data)
  }