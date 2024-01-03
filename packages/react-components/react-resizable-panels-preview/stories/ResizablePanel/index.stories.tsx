import { ResizablePanel } from '@fluentui/react-resizable-panels-preview';

import descriptionMd from './ResizablePanelDescription.md';
import bestPracticesMd from './ResizablePanelBestPractices.md';

export { Default } from './ResizablePanelDefault.stories';

export default {
  title: 'Preview Components/ResizablePanel',
  component: ResizablePanel,
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
};
