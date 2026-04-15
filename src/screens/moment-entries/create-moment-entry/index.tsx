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
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { ScrollView } from 'react-native'
import { toast } from 'sonner-native'
import { z } from 'zod'
import { SituationType } from './types'

export function CreateMomentEntry() {
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

  const { mutateAsync: createMomentEntry } = useMutation({
    mutationFn: async (data: CreateMomentEntrySchema) => {
      const momentEntry = await supabaseClient
        .rpc('create_moment_entry' as any, {
          p_emotion: data.emotion,
          p_situation_id: (data.situation.type === 'predefined'
            ? data.situation.id
            : null)!,
          p_situation_description: (data.situation.type === 'predefined'
            ? null
            : data.situation.description)!,
          p_date: data.rememberDate ? data.date || null : null,
          p_notes: (data.notes || null)!,
        })
        .single<string>()

      if (momentEntry.error) {
        const message =
          CREATE_MOMENT_ENTRY_ERROR_MESSAGES_MAP[momentEntry.error.message] ||
          CREATE_MOMENT_ENTRY_ERROR_MESSAGES_MAP.DEFAULT

        throw new Error(message)
      }
    },
    onSuccess: () => {
      toast.success('Registro salvo com sucesso')
      form.reset()
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MOMENT_ENTRIES.ALL,
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

  const form = useForm({
    defaultValues: {
      emotion: '',
      notes: '',
      date: getCurrentDateString(),
      rememberDate: false,
      situation: {
        id: '',
        type: 'predefined',
        description: '',
      },
    },
    validators: {
      onSubmit: createMomentEntrySchema,
    },
    onSubmit: ({ value }) =>
      createMomentEntry({
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
            <Text variant="title">Novo registro de momento</Text>
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
                children={([situationType]) => {
                  return (
                    <form.Field
                      name="situation.id"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Situação
                            </FieldLabel>
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
                  )
                }}
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

const createMomentEntrySchema = z.object({
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

type CreateMomentEntrySchema = z.infer<typeof createMomentEntrySchema>

const CREATE_MOMENT_ENTRY_ERROR_MESSAGES_MAP: Record<string, string> = {
  DEFAULT: 'Erro ao criar registro do momento',
}
