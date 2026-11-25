import { PressableFeedback } from '@/components/ui/pressable-feedback'
import { Text } from '@/components/ui/text'
import type { Href } from 'expo-router'
import { Link } from 'expo-router'
import type { ComponentProps } from 'react'

type TextLinkProps = {
  href: Href
  children: string
  prompt?: string
  underline?: boolean
} & Omit<ComponentProps<typeof Text>, 'children'>

export function TextLink({
  href,
  children,
  prompt,
  underline = false,
  color = 'foregroundSecondary',
  ...textProps
}: TextLinkProps) {
  return (
    <>
      {prompt != null ? (
        <Text color="foregroundSecondary">{prompt} </Text>
      ) : null}
      <Link href={href} asChild>
        <PressableFeedback>
          <Text
            color={color}
            textDecorationLine={underline ? 'underline' : undefined}
            {...textProps}
          >
            {children}
          </Text>
        </PressableFeedback>
      </Link>
    </>
  )
}
