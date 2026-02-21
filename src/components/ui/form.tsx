import { Box } from './box'

export function Form(props: React.ComponentProps<typeof Box>) {
  return <Box flex={1} justifyContent="space-between" gap="lg" {...props} />
}
