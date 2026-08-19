import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider } from 'baseui';
import ExtensionManager from "@/components/ExtensionManager.tsx";

const engine = new Styletron();

export default function App() {
  return (
      <StyletronProvider value={engine}>
        <BaseProvider theme={LightTheme}>
          <div style={{ padding: '2rem' }}>
            <ExtensionManager />
          </div>
        </BaseProvider>
      </StyletronProvider>
  );
}