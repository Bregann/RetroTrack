export default async function Page({
  params,
}: {
  params: Promise<{ consoleId: string }>
}) {
  const { consoleId } = await params

  return (
    <main>
      <h1>Console ID: {consoleId}</h1>
      <p>This is a placeholder for the console id content.</p>
      <p>Future implementation will go here.</p>
    </main>
  )
}
