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
import { QUERY_KEYS } from '@/constants/keys'
import { PADDING_BOTTOM_FORM_FOOTER_HEIGHT } from '@/constants/styles'
import { supabaseClient } from '@/lib/supabase/client'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ScrollView } from 'react-native'
import { toast } from 'sonner-native'
import { z } from 'zod'

export function EditDailyEntry() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const { data, isPending } = useQuery({
    queryFn: async () => {
      const result = await supabaseClient
        .from('daily_entries')
        .select('id, emotion, notes')
        .eq('id', id)
        .is('deleted_at', null)
        .single()

      if (result.error) {
        throw new Error('Erro ao buscar registro diário')
      }

      return result.data
    },
    queryKey: [...QUERY_KEYS.DAILY_ENTRIES.GET_TO_EDIT, id],
    throwOnError: true,
  })

  if (isPending) {
    return <LoadingScreen />
  }

  if (!data) {
    return null
  }

  return <EditDailyEntryForm data={data} />
}

type DailyEntryData = {
  id: string
  emotion: string
  notes: string | null
}

function EditDailyEntryForm({ data }: { data: DailyEntryData }) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync: editDailyEntry } = useMutation({
    mutationFn: async (values: EditDailyEntrySchema) => {
      const result = await supabaseClient
        .from('daily_entries')
        .update({
          emotion: values.emotion,
          notes: values.notes || null,
        })
        .eq('id', data.id)
        .is('deleted_at', null)

      if (result.error) {
        throw new Error('Erro ao editar registro diário')
      }
    },
    onSuccess: () => {
      toast.success('Registro atualizado com sucesso')
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DAILY_ENTRIES.ALL })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DAILY_ENTRIES.TODAY,
      })
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.DAILY_ENTRIES.PREVIEW,
      })
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.DAILY_ENTRIES.GET_TO_EDIT, data.id],
        exact: true,
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

  const form = useForm({
    defaultValues: {
      emotion: data.emotion,
      notes: data.notes || '',
    },
    validators: {
      onSubmit: editDailyEntrySchema,
    },
    onSubmit: ({ value }) => editDailyEntry(value),
  })

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
            <Text variant="title">Editar registro diário</Text>
          </Box>
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

const editDailyEntrySchema = z.object({
  emotion: z.string().trim().nonempty('Obrigatório'),
  notes: z.string().trim(),
})

type EditDailyEntrySchema = z.infer<typeof editDailyEntrySchema>
