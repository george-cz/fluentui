import { List } from '@fluentui/react-list-preview';

import descriptionMd from './ListDescription.md';
import bestPracticesMd from './ListBestPractices.md';

export { Default } from './ListDefault.stories';
export { ListHorizontal } from './ListHorizontal.stories';
export { ListGrid } from './ListGrid.stories';
export { ListWithAction } from './ListWithAction.stories';
export { ListMultipleActions } from './ListMultipleActions.stories';
export { ListSelection } from './ListSelection.stories';
export { ListSelectionUncontrolled } from './ListSelectionUncontrolled.stories';
export { ListSelectionControlled } from './ListSelectionControlled.stories';
export { VirtualizedList } from './VirtualizedList.stories';
export { VirtualizedListWithActionableItems } from './VirtualizedListWithActionableItems.stories';

export default {
  title: 'Preview Components/List',
  component: List,
  parameters: {
    docs: {
      description: {
        component: [descriptionMd, bestPracticesMd].join('\n'),
      },
    },
  },
};
