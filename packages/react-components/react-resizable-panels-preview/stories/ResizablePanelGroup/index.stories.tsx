import { ResizablePanelGroup } from '@fluentui/react-resizable-panels-preview';

import descriptionMd from './ResizablePanelGroupDescription.md';
import bestPracticesMd from './ResizablePanelGroupBestPractices.md';

export { Default } from './ResizablePanelGroupDefault.stories';

export default {
  title: 'Preview Components/ResizablePanelGroup',
  component: ResizablePanelGroup,
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
};
