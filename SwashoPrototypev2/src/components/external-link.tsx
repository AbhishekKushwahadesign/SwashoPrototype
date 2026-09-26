import { type ComponentProps, type ReactNode } from 'react';
import { Linking, Pressable } from 'react-native';

type ExternalLinkProps = Omit<ComponentProps<typeof Pressable>, 'children'> & {
  href: string;
  asChild?: boolean;
  children: ReactNode;
};

export function ExternalLink({ href, asChild, children, ...props }: ExternalLinkProps) {
  if (asChild) {
    return children;
  }

  return (
    <Pressable onPress={() => Linking.openURL(href)} {...props}>
      {children}
    </Pressable>
  );
}
