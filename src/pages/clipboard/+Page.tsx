import '../../code.css'

export function Page() {
  const onClick = async () => {
    const items = await navigator.clipboard.read()
    console.log(items)
  }
  return (
    <>
      <h1>Clipboard</h1>
      <button onClick={onClick}>Print items</button>
    </>
  )
}
