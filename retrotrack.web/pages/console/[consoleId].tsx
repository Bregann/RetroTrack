import { useRouter } from 'next/router'

const Console = () => {
    const router = useRouter()
    const { consoleId } = router.query
    return ( 
        <h1>console: {consoleId}</h1>
     );
}
 
export default Console;