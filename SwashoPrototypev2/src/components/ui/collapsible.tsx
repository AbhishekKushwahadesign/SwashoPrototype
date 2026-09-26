import { type PropsWithChildren, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type CollapsibleProps = PropsWithChildren<{
  title: string;
}>;

export function Collapsible({ title, children }: CollapsibleProps) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable onPress={() => setOpen((value) => !value)}>
        <Text>{title}</Text>
      </Pressable>
      {open ? children : null}
    </View>
  );
}
