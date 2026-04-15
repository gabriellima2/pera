import { BackButton } from '@/components/buttons/back-button'
import { BooleanSelector } from '@/components/selectors/boolean-selector'
import { EmotionSelector } from '@/components/selectors/emotion-selector'
import { SituationSelector } from '@/components/selectors/situation-selector'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoadingScreen } from '@/components/ui/loading'
import { Text } from '@/components/ui/text'
import { Textarea } from '@/components/ui/textarea'
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
import type { SituationType } from './types'

export function EditMomentEntry() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const { data: momentEntry, isPending: isLoadingMomentEntry } = useQuery({
    queryFn: async () => {
      const result = await supabaseClient
        .from('moment_entries')
        .select(
          'id, emotion, notes, date, situation_description, situations ( id, label, code )',
        )
        .eq('id', id)
        .single()

      if (result.error) {
        throw new Error('Erro ao buscar registro de momento')
      }

      return result.data
    },
    queryKey: [...QUERY_KEYS.MOMENT_ENTRIES.GET_TO_EDIT, id],
    throwOnError: true,
  })

  if (isLoadingMomentEntry) {
    return <LoadingScreen />
  }

  if (!momentEntry) {
    return null
  }

  return <EditMomentEntryForm momentEntry={momentEntry} />
}

type MomentEntryData = {
  id: string
  emotion: string
  notes: string | null
  date: string | null
  situation_description: string | null
  situations: { id: string; label: string; code: string } | null
}

function EditMomentEntryForm({
  momentEntry,
}: {
  momentEntry: MomentEntryData
}) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: situations, isPending: isLoadingSituations } = useQuery({
    queryFn: async () => {
      const situations = await supabaseClient
        .from('situations')
        .select('id, code, label')
        .order('order', { ascending: true, nullsFirst: false })
        .eq('active', true)

      if (situations.error) {
        throw new Error('Erro ao buscar situações')
      }

      return situations.data
    },
    queryKey: QUERY_KEYS.SITUATIONS.OPTIONS,
    throwOnError: true,
  })

  const { mutateAsync: editMomentEntry } = useMutation({
    mutationFn: async (values: EditMomentEntrySchema) => {
      const result = await supabaseClient.rpc('edit_moment_entry' as any, {
        p_moment_entry_id: momentEntry.id,
        p_emotion: values.emotion,
        p_situation_id: (values.situation.type === 'predefined'
          ? values.situation.id
          : null)!,
        p_situation_description: (values.situation.type === 'predefined'
          ? null
          : values.situation.description)!,
        p_date: values.rememberDate ? values.date || null : null,
        p_notes: (values.notes || null)!,
      })

      if (result.error) {
        const message =
          EDIT_MOMENT_ENTRY_ERROR_MESSAGES_MAP[result.error.message] ||
          EDIT_MOMENT_ENTRY_ERROR_MESSAGES_MAP.DEFAULT

        throw new Error(message)
      }
    },
    onSuccess: () => {
      toast.success('Registro atualizado com sucesso')
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MOMENT_ENTRIES.ALL,
      })
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.MOMENT_ENTRIES.GET_TO_EDIT, momentEntry.id],
        exact: true,
      })
      if (router.canGoBack()) {
        router.back()
      } else {
        router.replace('/(private)/(tabs)/(moment-entries)')
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const defaultSituation = useMemo(() => {
    if (momentEntry.situations) {
      return {
        id: momentEntry.situations.id,
        type: 'predefined' as SituationType,
        description: '',
      }
    }
    return {
      id: '',
      type: 'custom' as SituationType,
      description: momentEntry.situation_description || '',
    }
  }, [momentEntry.situations, momentEntry.situation_description])

  const form = useForm({
    defaultValues: {
      emotion: momentEntry.emotion,
      notes: momentEntry.notes || '',
      date: momentEntry.date || getCurrentDateString(),
      rememberDate: !!momentEntry.date,
      situation: defaultSituation,
    },
    validators: {
      onSubmit: editMomentEntrySchema,
    },
    onSubmit: ({ value }) =>
      editMomentEntry({
        ...value,
        situation: {
          ...value.situation,
          type: value.situation.type as SituationType,
        },
      }),
  })

  const situationsOptions = useMemo(() => {
    if (!situations) return []
    return situations.map((situation) => ({
      value: situation.id,
      label: situation.label,
    }))
  }, [situations])

  function handleSituationChange(
    situationId: string,
    situationType: SituationType,
  ) {
    form.setFieldValue('situation.id', situationId)
    form.setFieldValue('situation.type', situationType)
    form.setFieldValue('situation.description', '')
  }

  if (isLoadingSituations) {
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
        <Box flex={1} px="md" mt="lg" gap="lg">
          <Box gap="md" flexDirection="row" alignItems="center" height={42}>
            <BackButton />
            <Text variant="title">Editar registro de momento</Text>
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
              <form.Subscribe
                selector={(state) => [
                  state.values.situation.type as SituationType,
                ]}
                children={([situationType]) => (
                  <form.Field
                    name="situation.id"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Situação</FieldLabel>
                          <SituationSelector
                            id={field.name}
                            type={situationType}
                            value={field.state.value}
                            situations={situationsOptions}
                            onSelect={(value, type) => {
                              handleSituationChange(value, type)
                            }}
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )
                    }}
                  />
                )}
              />
              <form.Subscribe
                selector={(state) => [state.values.situation.type]}
                children={([situationType]) =>
                  situationType === 'custom' ? (
                    <form.Field
                      name="situation.description"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Descreva a situação
                            </FieldLabel>
                            <Input
                              id={field.name}
                              value={field.state.value}
                              placeholder="Descreva a situação"
                              onChangeText={field.handleChange}
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />
                  ) : null
                }
              />
              <form.Field
                name="rememberDate"
                listeners={{
                  onChange: () => {
                    form.setFieldValue('date', getCurrentDateString())
                  },
                }}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Lembrar data?
                      </FieldLabel>
                      <BooleanSelector
                        value={field.state.value}
                        onSelect={field.handleChange}
                      />
                    </Field>
                  )
                }}
              />
              <form.Subscribe
                selector={(state) => [state.values.rememberDate]}
                children={([rememberDate]) =>
                  rememberDate ? (
                    <form.Field
                      name="date"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>Data</FieldLabel>
                            <DatePicker
                              id={field.name}
                              value={field.state.value}
                              onChangeDate={field.handleChange}
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        )
                      }}
                    />
                  ) : null
                }
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

const editMomentEntrySchema = z.object({
  emotion: z.string().trim().nonempty('Obrigatório'),
  situation: z.discriminatedUnion('type', [
    z.object({
      id: z.string(),
      type: z.literal('custom'),
      description: z.string().trim().nonempty('Obrigatório'),
    }),
    z.object({
      id: z.string().trim().nonempty('Obrigatório'),
      type: z.literal('predefined'),
      description: z.string(),
    }),
  ]),
  rememberDate: z.boolean(),
  date: z.string().trim(),
  notes: z.string().trim(),
})

type EditMomentEntrySchema = z.infer<typeof editMomentEntrySchema>

const EDIT_MOMENT_ENTRY_ERROR_MESSAGES_MAP: Record<string, string> = {
  DEFAULT: 'Erro ao editar registro de momento',
  MOMENT_ENTRY_NOT_FOUND: 'Registro de momento não encontrado',
}
