import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { LoadingScreen } from '@/components/ui/loading'
import { Text } from '@/components/ui/text'
import { EMOTIONS_ENUM } from '@/constants/enums'
import { QUERY_KEYS } from '@/constants/keys'
import { supabaseClient } from '@/lib/supabase/client'
import { theme } from '@/theme'
import { getCurrentDateString } from '@/utils/date'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { CircleCheck } from 'lucide-react-native'
import { useMemo } from 'react'
import { Pressable, TextInput } from 'react-native'
import { toast } from 'sonner-native'
import { z } from 'zod'

export function CreateDailyEntry() {
  const { emotion } = useLocalSearchParams<{ emotion: string }>()
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: hasTodayDailyEntry, isPending: isLoadingHasTodayDailyEntry } =
    useQuery({
      queryFn: async () => {
        const dailyEntry = await supabaseClient
          .from('daily_entries')
          .select('date')
          .eq('date', getCurrentDateString())

        if (dailyEntry.error) {
          throw new Error(
            'Erro ao validar se existe um registro diário para o dia atual',
          )
        }

        return !!dailyEntry.data?.[0]
      },
      queryKey: QUERY_KEYS.DAILY_ENTRIES.HAS_TODAY,
      throwOnError: true,
    })

  const { mutateAsync: createDailyEntry } = useMutation({
    mutationFn: async (data: CreateDailyEntrySchema) => {
      const dailyEntry = await supabaseClient
        .rpc('create_daily_entry', {
          p_emotion: data.emotion,
          p_date: getCurrentDateString(),
          p_notes: (data.notes || null)!,
        })
        .single<string>()

      if (dailyEntry.error) {
        const message =
          CREATE_DAILY_ENTRY_ERROR_MESSAGES_MAP[dailyEntry.error.message] ||
          CREATE_DAILY_ENTRY_ERROR_MESSAGES_MAP.DEFAULT

        throw new Error(message)
      }
    },
    onSuccess: () => {
      toast.success('Registro salvo com sucesso')
      form.reset()
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DAILY_ENTRIES.ALL,
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DAILY_ENTRIES.TODAY,
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DAILY_ENTRIES.HAS_TODAY,
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DAILY_ENTRIES.PREVIEW,
      })
      router.replace('/(private)/(tabs)')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const isValidEmotion = useMemo(() => {
    return Object.values(EMOTIONS_ENUM).includes(emotion)
  }, [emotion])

  const form = useForm({
    defaultValues: {
      emotion: isValidEmotion ? emotion : '',
      notes: '',
    },
    validators: {
      onSubmit: createDailyEntrySchema,
    },
    onSubmit: ({ value }) => createDailyEntry(value),
  })

  if (isLoadingHasTodayDailyEntry) {
    return <LoadingScreen />
  }

  if (hasTodayDailyEntry) {
    return (
      <Box>
        <Text>Você já criou um registro diário para hoje</Text>
        <Link href="/(private)/(tabs)">
          <Text>Voltar</Text>
        </Link>
      </Box>
    )
  }

  return (
    <Box>
      <Box gap="lg">
        <form.Field
          name="emotion"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Box data-invalid={isInvalid}>
                <Text nativeID={field.name}>Emoção</Text>
                <Box>
                  <Pressable
                    onPress={() => field.handleChange(EMOTIONS_ENUM.CALM)}
                  >
                    <Text>
                      Calmo{' '}
                      {field.state.value === EMOTIONS_ENUM.CALM && (
                        <CircleCheck color={theme.colors.foreground} />
                      )}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => field.handleChange(EMOTIONS_ENUM.HAPPY)}
                  >
                    <Text>
                      Feliz{' '}
                      {field.state.value === EMOTIONS_ENUM.HAPPY && (
                        <CircleCheck color={theme.colors.foreground} />
                      )}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => field.handleChange(EMOTIONS_ENUM.NEUTRAL)}
                  >
                    <Text>
                      Neutro
                      {field.state.value === EMOTIONS_ENUM.NEUTRAL && (
                        <CircleCheck color={theme.colors.foreground} />
                      )}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => field.handleChange(EMOTIONS_ENUM.ANXIOUS)}
                  >
                    <Text>
                      Ansioso
                      {field.state.value === EMOTIONS_ENUM.ANXIOUS && (
                        <CircleCheck color={theme.colors.foreground} />
                      )}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => field.handleChange(EMOTIONS_ENUM.SAD)}
                  >
                    <Text>
                      Triste{' '}
                      {field.state.value === EMOTIONS_ENUM.SAD && (
                        <CircleCheck color={theme.colors.foreground} />
                      )}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => field.handleChange(EMOTIONS_ENUM.FRUSTRATED)}
                  >
                    <Text>
                      Frustrado
                      {field.state.value === EMOTIONS_ENUM.FRUSTRATED && (
                        <CircleCheck color={theme.colors.foreground} />
                      )}
                    </Text>
                  </Pressable>
                </Box>
                {isInvalid && (
                  <Text>{field.state.meta.errors?.[0]?.message}</Text>
                )}
              </Box>
            )
          }}
        />
        <form.Field
          name="notes"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Box data-invalid={isInvalid}>
                <Text nativeID={field.name}>Anotações</Text>
                <TextInput
                  multiline
                  numberOfLines={4}
                  value={field.state.value as string}
                  textAlignVertical="top"
                  keyboardAppearance="light"
                  placeholder="Digite suas anotações"
                  aria-labelledby={field.name}
                  placeholderTextColor={theme.colors.mutedForeground}
                  onChangeText={(text) => field.handleChange(text)}
                  style={{ color: theme.colors.foreground }}
                />
                {isInvalid && (
                  <Text>{field.state.meta.errors?.[0]?.message}</Text>
                )}
              </Box>
            )
          }}
        />
      </Box>
      <form.Subscribe
        selector={(state) => [state.isSubmitting]}
        children={([isSubmitting]) => (
          <Button
            label="Salvar"
            loading={isSubmitting}
            onPress={() => form.handleSubmit()}
          />
        )}
      />
    </Box>
  )
}

const createDailyEntrySchema = z.object({
  emotion: z.string().trim().nonempty('Obrigatório'),
  notes: z.string().trim(),
})

type CreateDailyEntrySchema = z.infer<typeof createDailyEntrySchema>

const CREATE_DAILY_ENTRY_ERROR_MESSAGES_MAP: Record<string, string> = {
  DEFAULT: 'Erro ao criar registro diário',
  ALREADY_EXISTS: 'Já existe um registro para o dia atual',
}
