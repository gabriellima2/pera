import { Box } from './box'

export function Form(props: React.ComponentProps<typeof Box>) {
  return <Box gap="lg" {...props} />
}
