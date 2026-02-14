import { Box } from '@/components/ui/box'
import Button from '@/components/ui/button'
import { LoadingScreen } from '@/components/ui/loading'
import { Text } from '@/components/ui/text'
import { supabaseClient } from '@/lib/supabase/client'
import { theme } from '@/theme'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { CircleCheck } from 'lucide-react-native'
import { Pressable, TextInput } from 'react-native'
import { toast } from 'sonner-native'
import { z } from 'zod'

export default function CreateMomentEntry() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: situations, isPending: isLoadingSituations } = useQuery({
    queryFn: async () => {
      const user = await supabaseClient.auth.getUser()
      if (user.error) {
        throw new Error('Você precisa estar autenticado para buscar situações')
      }

      const situations = await supabaseClient
        .from('situations')
        .select('id, code, label')
        .order('order', { ascending: true, nullsFirst: false })
        .eq('active', true)

      if (situations.error) {
        console.error(situations.error)
        throw new Error('Erro ao buscar situações')
      }

      return situations.data
    },
    queryKey: ['situations'],
    throwOnError: (error) => {
      toast.error(error.message)
      if (error.message.includes('Você precisa estar autenticado')) {
        router.replace('/')
      }
      return false
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  const { mutateAsync: createMomentEntry } = useMutation({
    mutationFn: async (data: CreateMomentEntrySchema) => {
      const user = await supabaseClient.auth.getUser()
      if (user.error) {
        toast.error('Você precisa estar autenticado para criar um registro')
        router.replace('/')
        return
      }

      const momentEntry = await supabaseClient
        .rpc('create_moment_entry' as any, {
          p_emotion: data.emotion,
          p_situation_id: (data.situation.type === 'predefined'
            ? data.situation.id
            : null)!,
          p_situation_description: (data.situation.type === 'predefined'
            ? null
            : data.situation.description)!,
          p_date: getCurrentDateString(),
          p_notes: (data.notes || null)!,
        })
        .single<string>()

      if (momentEntry.error) {
        console.error(momentEntry.error)

        const message =
          CREATE_MOMENT_ENTRY_ERROR_MESSAGES_MAP[momentEntry.error.message] ||
          CREATE_MOMENT_ENTRY_ERROR_MESSAGES_MAP.DEFAULT

        throw new Error(message)
      }
    },
    onSuccess: () => {
      toast.success('Registro salvo com sucesso')
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['moment-entries'] })
      router.replace('/(tabs)/moment-entries')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useForm({
    defaultValues: {
      emotion: '',
      notes: '',
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
          type: value.situation.type as 'custom' | 'predefined',
        },
      }),
  })

  if (isLoadingSituations) {
    return <LoadingScreen />
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
                  <Pressable onPress={() => field.handleChange('calm')}>
                    <Text>
                      Calmo{' '}
                      {field.state.value === 'calm' && (
                        <CircleCheck color={theme.colors.foreground} />
                      )}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => field.handleChange('happy')}>
                    <Text>
                      Feliz{' '}
                      {field.state.value === 'happy' && (
                        <CircleCheck color={theme.colors.foreground} />
                      )}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => field.handleChange('neutral')}>
                    <Text>
                      Neutro
                      {field.state.value === 'neutral' && (
                        <CircleCheck color={theme.colors.foreground} />
                      )}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => field.handleChange('anxious')}>
                    <Text>
                      Ansioso
                      {field.state.value === 'anxious' && (
                        <CircleCheck color={theme.colors.foreground} />
                      )}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => field.handleChange('sad')}>
                    <Text>
                      Triste{' '}
                      {field.state.value === 'sad' && (
                        <CircleCheck color={theme.colors.foreground} />
                      )}
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => field.handleChange('frustrated')}>
                    <Text>
                      Frustrado
                      {field.state.value === 'frustrated' && (
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
        <form.Subscribe
          selector={(state) => [state.values.situation.type]}
          children={([situationType]) => {
            return (
              <form.Field
                name="situation.id"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Box data-invalid={isInvalid}>
                      <Text nativeID={field.name}>Situação</Text>
                      <Box>
                        {situations?.length ? (
                          <>
                            {situations?.map((situation) => (
                              <Pressable
                                key={situation.id}
                                onPress={() => {
                                  field.handleChange(situation.id)

                                  form.setFieldValue(
                                    'situation.type',
                                    'predefined',
                                  )
                                  form.setFieldValue(
                                    'situation.description',
                                    '',
                                  )
                                }}
                              >
                                <Text>
                                  {situation.label}
                                  {field.state.value === situation.id && (
                                    <CircleCheck
                                      color={theme.colors.foreground}
                                    />
                                  )}
                                </Text>
                              </Pressable>
                            ))}
                            <Pressable
                              onPress={() => {
                                field.handleChange('')

                                form.setFieldValue('situation.type', 'custom')
                                form.setFieldValue('situation.description', '')
                              }}
                            >
                              <Text>Outro</Text>
                            </Pressable>
                          </>
                        ) : (
                          <Text>Nenhuma situação encontrada</Text>
                        )}
                      </Box>
                      {isInvalid && (
                        <Text>{field.state.meta.errors?.[0]?.message}</Text>
                      )}
                    </Box>
                  )
                }}
              />
            )
          }}
        />
        <form.Subscribe
          selector={(state) => [state.values.situation.type]}
          children={([situationType]) => (
            <>
              {situationType === 'custom' && (
                <form.Field
                  name="situation.description"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Box data-invalid={isInvalid}>
                        <Text nativeID={field.name}>Descreva a situação</Text>
                        <TextInput
                          value={field.state.value as string}
                          keyboardAppearance="light"
                          placeholder="Descreva a situação"
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
              )}
            </>
          )}
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
  notes: z.string().trim(),
})

type CreateMomentEntrySchema = z.infer<typeof createMomentEntrySchema>

function getCurrentDateString() {
  const date = new Date()
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

const CREATE_MOMENT_ENTRY_ERROR_MESSAGES_MAP: Record<string, string> = {
  DEFAULT: 'Erro ao criar registro',
  SITUATION_NOT_FOUND: 'Situação não encontrada',
}
