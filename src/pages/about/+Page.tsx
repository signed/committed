import { useEffect, useState } from 'react'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { Counter } from './Counter'
import type { AppRouter } from '../../../server'
import '../../code.css'

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/trpc',
    }),
  ],
})

function Page() {
  const [data, setData] = useState('')

  useEffect(() => {
    client.hello.query('Berry').then((data) => setData(data))
  }, [])
  return (
    <>
      <h1>About</h1>
      <p>
        Example of using <code>vite-plugin-ssr</code>.
      </p>
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
      <ul>
        <li>trpc</li>
        <li>{data}</li>
      </ul>
    </>
  )
}

export default Page
