import { useSyncExternalStore, type ReactNode } from "react";
import { View } from "react-native";
import { Stack } from "react-native-screens";

import { GLASS_HEADER_OPTIONS } from "../../native/glass-header-options";
import { V5StackHeader } from "../../native/V5StackHeader.ios";
import {
  InspectorCloseContext,
  useInspectorBarSlot,
  type InspectorBarStore,
} from "./inspector-bar-store";
import { WorkspaceSlotOptionsContext } from "../../native/v5-workspace-context";

// The glass options the workspace's own screens get from their navigator, which this bar lacks.
const INSPECTOR_BAR_OPTIONS = { ...GLASS_HEADER_OPTIONS, headerShown: false };

function InspectorBarHeader(props: { readonly store: InspectorBarStore }) {
  const options = useSyncExternalStore(props.store.subscribe, props.store.getSnapshot);
  return <V5StackHeader options={{ ...INSPECTOR_BAR_OPTIONS, ...options }} canGoBack={false} />;
}

/**
 * An inspector pane on its own one-screen native stack, with the bar its AppBar sets. Panes stay
 * mounted while hidden, and UIKit blurs a bar under the scroll view last registered with its
 * screen, so each pane needs a screen of its own.
 */
export function InspectorPane(props: { readonly children: ReactNode }) {
  const { store, slot } = useInspectorBarSlot();
  return (
    <Stack.Host>
      <Stack.Screen screenKey="inspector" activityMode="attached">
        <InspectorBarHeader store={store} />
        <View className="flex-1 bg-screen">
          <WorkspaceSlotOptionsContext value={slot}>{props.children}</WorkspaceSlotOptionsContext>
        </View>
      </Stack.Screen>
    </Stack.Host>
  );
}

/** Hosts the inspector's content as a pane whose bar can close the inspector. */
export function InspectorBar(props: {
  readonly onClose: () => void;
  readonly children: ReactNode;
}) {
  return (
    <InspectorCloseContext value={props.onClose}>
      <InspectorPane>{props.children}</InspectorPane>
    </InspectorCloseContext>
  );
}
