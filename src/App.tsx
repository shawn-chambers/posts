import { useEffect, useState } from "react";

type Post = {
  "userId": number,
  "id": number,
  "title": string,
  "body": string,
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new Error('error fetching posts');
        const formatted = await response.json()
        setPosts(formatted.reverse());
      } catch (err) {
        console.error(err);
      }
    }

    fetchPosts();
  }, []);

  const postMessage = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Placeholder Title',
        body: message,
        userId: 1,
      })
    });
    if (response.ok) {
      // fails with multiple messages because api doesn't increment ids for unique child key
      const resMessage = await response.json();
      setPosts(prev => prev.concat(resMessage).reverse());
      setMessage('');
    }
  }

  return (
    <>
      <div className="p-24 grid grid-cols-3">
        <div className="flex flex-col gap-3 col-span-2 mr-6">
          {
            posts.map(({ title, body, id }) => (
              <Post title={title} body={body} key={id} />
            ))
          }
        </div>
        <div className="col-span-1 h-fit sticky top-24">
          <textarea onChange={(e) => setMessage(e.target.value)} value={message} placeholder="post here..." className="rounded-md h-[100px] w-full p-4  border border-grey-600"></textarea>
          <button disabled={!message.length} onClick={() => postMessage()} className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!message.length ? 'opacity-50 cursor-not-allowed' : ''}`}>Send</button>
        </div>
      </div>
    </>
  )
}


function Post({ title, body }: { title: string, body: string }) {
  return (
    <>
      <div className="border border-gray-600 rounded-md p-12">
        <h4 className="mb-4">{title}</h4>
        <div>{body}</div>
      </div>
    </>
  )
}

export default App;