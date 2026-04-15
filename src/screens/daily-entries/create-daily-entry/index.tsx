import type { EmotionType } from '@/@types/emotions'
import { BackButton } from '@/components/buttons/back-button'
import { EmotionSelector } from '@/components/selectors/emotion-selector'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { LoadingScreen } from '@/components/ui/loading'
import { Text } from '@/components/ui/text'
import { Textarea } from '@/components/ui/textarea'
import { EMOTION_TYPE_ENUM } from '@/constants/enums'
import { QUERY_KEYS } from '@/constants/keys'
import { PADDING_BOTTOM_FORM_FOOTER_HEIGHT } from '@/constants/styles'
import { supabaseClient } from '@/lib/supabase/client'
import { getCurrentDateString } from '@/utils/date'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo } from 'react'
import { ScrollView } from 'react-native'
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
          .is('deleted_at', null)

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

      if (router.canGoBack()) {
        router.back()
      } else {
        router.replace('/(private)/(tabs)/(daily-entries)')
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const isValidEmotion = useMemo(() => {
    return Object.values(EMOTION_TYPE_ENUM).includes(emotion as EmotionType)
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

  return (
    <Box flex={1}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: PADDING_BOTTOM_FORM_FOOTER_HEIGHT,
        }}
      >
        <Box px="md" flex={1} mt="lg" gap="lg">
          <Box gap="md" flexDirection="row" alignItems="center" height={42}>
            <BackButton />
            <Text variant="title">Novo registro diário</Text>
          </Box>
          {hasTodayDailyEntry ? (
            <Box py="xl" alignItems="center">
              <Text color="foregroundSecondary">
                Você já criou um registro diário para hoje.
              </Text>
            </Box>
          ) : (
            <Form>
              <FieldGroup>
                <form.Field
                  name="emotion"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Emoção</FieldLabel>
                        <EmotionSelector
                          id={field.name}
                          value={field.state.value}
                          onSelect={field.handleChange}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
                <form.Field
                  name="notes"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Anotações</FieldLabel>
                        <Textarea
                          id={field.name}
                          value={field.state.value}
                          placeholder="Digite suas anotações"
                          onChangeText={field.handleChange}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
              </FieldGroup>
            </Form>
          )}
        </Box>
      </ScrollView>
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        px="md"
        pb="lg"
        backgroundColor="background"
      >
        <form.Subscribe
          selector={(state) => [state.isSubmitting]}
          children={([isSubmitting]) => (
            <Button
              label="Salvar"
              loading={isSubmitting}
              onPress={form.handleSubmit}
            />
          )}
        />
      </Box>
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
