import type { ReactNode } from "react";

import { InspectorCloseContext, useInspectorBarSlot } from "./inspector-bar-store";
import { WorkspaceSlotOptionsContext } from "../../native/v5-workspace-context";

/** AppBar draws the bar inline on Android; the slot keeps its options off the thread's route. */
export function InspectorPane(props: { readonly children: ReactNode }) {
  const { slot } = useInspectorBarSlot();
  return <WorkspaceSlotOptionsContext value={slot}>{props.children}</WorkspaceSlotOptionsContext>;
}

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
