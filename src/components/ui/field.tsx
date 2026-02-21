import { useMemo } from 'react'
import { Box } from './box'
import { Label } from './label'
import { Text } from './text'

function FieldGroup(props: React.ComponentProps<typeof Box>) {
  return <Box gap="lg" {...props} />
}

function Field(props: React.ComponentProps<typeof Box>) {
  return <Box gap="sm" {...props} />
}

function FieldLabel(props: React.ComponentProps<typeof Label>) {
  return <Label {...props} />
}

function FieldError({
  children,
  errors,
  ...props
}: React.ComponentProps<typeof Text> & {
  errors?: ({ message?: string } | undefined)[]
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    return uniqueErrors[0]?.message ?? null
  }, [children, errors])

  if (!content) {
    return null
  }

  return <Text {...props}>{content}</Text>
}

export { Field, FieldError, FieldGroup, FieldLabel }
