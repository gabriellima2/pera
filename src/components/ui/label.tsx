import { Text } from './text'

export function Label({
  htmlFor,
  ...props
}: Omit<React.ComponentProps<typeof Text>, 'nativeID'> & {
  htmlFor?: string
}) {
  return <Text variant="bodyMedium" nativeID={htmlFor} {...props} />
}
