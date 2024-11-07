import { useEffect, useState } from 'react'
import { Counter } from './Counter'
import '../../code.css'
import { client } from '../../../server/trpc/client'

function Page() {
  const [data, setData] = useState('')

  useEffect(() => {
    client.hello.query('Berry').then((data) => setData(data))
  }, [])
  return (
    <>
      <h1>About</h1>
      <p>
        Example of using <code>vike</code>.
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
