import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  CreateExercisePayload,
  Exercise,
  ExerciseDo,
  NakijkmodelResponse,
} from '@/lib/api'
import { apiFetch, ApiError, EXERCISES_API_PATH } from '@/lib/api'

export const exerciseQueryKeys = {
  all: ['oefeningen'] as const,
  detail: (id: number | undefined) => ['oefeningen', id] as const,
  nakijkmodel: (id: number | undefined) => ['oefeningen', id, 'nakijkmodel'] as const,
}

async function createExercise(payload: CreateExercisePayload): Promise<Exercise> {
  const res = await apiFetch(`${EXERCISES_API_PATH}/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body)
  }
  return res.json() as Promise<Exercise>
}

async function fetchExerciseList(): Promise<Exercise[]> {
  const res = await apiFetch(`${EXERCISES_API_PATH}/`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body)
  }
  const data = await res.json()
  if (Array.isArray(data)) return data as Exercise[]
  const paginated = data as { results?: Exercise[] }
  return Array.isArray(paginated.results) ? paginated.results : []
}

async function fetchExerciseDetail(id: number): Promise<ExerciseDo> {
  const res = await apiFetch(`${EXERCISES_API_PATH}/${id}/`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body)
  }
  return res.json() as Promise<ExerciseDo>
}

async function fetchNakijkmodel(exerciseId: number): Promise<NakijkmodelResponse> {
  const res = await apiFetch(`${EXERCISES_API_PATH}/${exerciseId}/nakijkmodel/`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body)
  }
  return res.json() as Promise<NakijkmodelResponse>
}

/**
 * Creates an exercise (generate). On success invalidates exercise list for future use.
 */
export function useCreateExercise() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: exerciseQueryKeys.all })
    },
  })
}

/** List exercises (for OefenenPage). */
export function useExerciseList() {
  return useQuery({
    queryKey: exerciseQueryKeys.all,
    queryFn: fetchExerciseList,
  })
}

/** Single exercise detail for doing (prompts, no answers). */
export function useExerciseDetail(id: number | undefined) {
  return useQuery({
    queryKey: exerciseQueryKeys.detail(id),
    queryFn: () => fetchExerciseDetail(id!),
    enabled: id != null && Number.isInteger(id),
  })
}

/** Nakijkmodel (correct answers) for an exercise. Fetch when user clicks "Bekijk nakijkmodel". */
export function useNakijkmodel(exerciseId: number | undefined) {
  return useQuery({
    queryKey: exerciseQueryKeys.nakijkmodel(exerciseId),
    queryFn: () => fetchNakijkmodel(exerciseId!),
    enabled: exerciseId != null && Number.isInteger(exerciseId),
  })
}
