import { ResizablePanelHandle } from '@fluentui/react-resizable-panels-preview';

import descriptionMd from './ResizablePanelHandleDescription.md';
import bestPracticesMd from './ResizablePanelHandleBestPractices.md';

export { Default } from './ResizablePanelHandleDefault.stories';

export default {
  title: 'Preview Components/ResizablePanelHandle',
  component: ResizablePanelHandle,
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
};
