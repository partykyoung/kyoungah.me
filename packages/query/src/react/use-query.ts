import { useQueryClient } from "./query-client-context.jsx";

function useBaseQuery(options: any, Observer: any, queryClient?: any) {
  const client = useQueryClient(queryClient);
}

function useQuery(options: any, queryClient?: any) {
  return useBaseQuery(options, QueryObserver, queryClient);
}

export { useQuery };
