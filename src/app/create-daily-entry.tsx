import { Box } from '@/components/ui/box'
import Button from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { supabaseClient } from '@/lib/supabase/client'
import { theme } from '@/theme'
import { useForm } from '@tanstack/react-form'
import { useMutation } from '@tanstack/react-query'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { CircleCheck } from 'lucide-react-native'
import { useMemo } from 'react'
import { Pressable, TextInput } from 'react-native'
import { toast } from 'sonner-native'
import { z } from 'zod'

export default function CreateDailyEntry() {
  const router = useRouter()
  const { emotion } = useLocalSearchParams<{ emotion: string }>()

  const { mutateAsync: createDailyEntry } = useMutation({
    mutationFn: async (data: CreateDailyEntrySchema) => {
      const user = await supabaseClient.auth.getUser()
      if (user.error) {
        toast.error('Você precisa estar autenticado para criar um registro')
        router.replace('/')
        return
      }

      const dailyEntry = await supabaseClient
        .rpc('create_daily_entry', {
          p_emotion: data.emotion,
          p_date: getCurrentDateString(),
          p_notes: (data.notes || null)!,
        })
        .single<string>()

      if (dailyEntry.error) {
        console.error(dailyEntry.error)

        const message =
          CREATE_DAILY_ENTRY_ERROR_MESSAGES_MAP[dailyEntry.error.message] ||
          CREATE_DAILY_ENTRY_ERROR_MESSAGES_MAP.DEFAULT

        throw new Error(message)
      }
    },
    onSuccess: () => {
      toast.success('Registro salvo com sucesso')
      form.reset()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const isValidEmotion = useMemo(() => {
    return [
      'calm',
      'happy',
      'neutral',
      'anxious',
      'sad',
      'frustrated',
    ].includes(emotion)
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

function getCurrentDateString() {
  const date = new Date()
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

const CREATE_DAILY_ENTRY_ERROR_MESSAGES_MAP: Record<string, string> = {
  DEFAULT: 'Erro ao criar registro',
  ALREADY_EXISTS: 'Já existe um registro para o dia atual',
}
