import { useRouter } from 'next/router'

const Console = () => {
    const router = useRouter()
    const { gameId } = router.query
    return ( 
        <h1>Coming soon :)</h1>
     );
}
 
export default Console;