// Single source of truth for the WebView -> Flutter bridge.
// Contract is LOCKED — must stay identical to docs/API_CONTRACT.md here and
// docs/INTEGRATION.md in the Unity repo. Change one, change all three.

export type LaunchMode = "navigate" | "freeExplore" | "findFriend";

export type LaunchArgs = {
  mode: LaunchMode;
  poiId?: string | null;
  poiName?: string | null;
  floor?: string | null;
  building?: string | null;
  connectionId?: string | null;
};

type DarsiBridge = { postMessage: (msg: string) => void };

/**
 * Send a launchAR message to the Flutter host via the `DarsiBridge` JavaScriptChannel
 * (webview_flutter). No-ops with a console log in a plain browser so the preview stays
 * debuggable without a Flutter host.
 */
export function launchAR(args: LaunchArgs): void {
  const payload = {
    action: "launchAR",
    mode: args.mode,
    poiId: args.poiId ?? null,
    poiName: args.poiName ?? null,
    floor: args.floor ?? null,
    building: args.building ?? null,
    connectionId: args.connectionId ?? null,
  };

  const bridge = (window as unknown as { DarsiBridge?: DarsiBridge }).DarsiBridge;
  if (bridge) {
    bridge.postMessage(JSON.stringify(payload));
  } else {
    // ponytail: no Flutter host in a plain browser — log instead so preview works
    console.log("[DarsiBridge stub] launchAR", payload);
  }
}

// Flutter → WebView: called when the AR session ends (docs/API_CONTRACT.md).
// Payload matches the Unity arSessionClosed event (docs/INTEGRATION.md).
export type ArSessionClosed = { arrived: boolean; poiId: string | null };

type WindowWithArHandler = { onARSessionClosed?: (p: ArSessionClosed) => void };

/**
 * Register the handler the Flutter host invokes when AR closes. The WebView keeps
 * its state (it is not reloaded) — this is only the notify hook. Returns a cleanup fn.
 */
export function onArSessionClosed(handler: (p: ArSessionClosed) => void): () => void {
  const w = window as unknown as WindowWithArHandler;
  w.onARSessionClosed = handler;
  return () => {
    if (w.onARSessionClosed === handler) delete w.onARSessionClosed;
  };
}
