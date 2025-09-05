import SearchComponent from '@/components/pages/SearchComponent'
import { Container } from '@mantine/core'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { doQueryGet } from '@/helpers/apiClient'
import { GetSearchConsolesResponse } from '@/interfaces/api/search/GetSearchConsolesResponse'

export default async function SearchPage() {
  const queryClient = new QueryClient()

  // Prefetch console data
  await queryClient.prefetchQuery({
    queryKey: ['searchConsoles'],
    queryFn: async () => await doQueryGet<GetSearchConsolesResponse>('/api/search/GetSearchConsoles'),
    staleTime: 300000 // 5 minutes
  })

  return (
    <Container size="100%" px="md" py="xl">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SearchComponent />
      </HydrationBoundary>
    </Container>
  )
}
