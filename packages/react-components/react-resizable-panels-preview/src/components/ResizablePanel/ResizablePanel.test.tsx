import * as React from 'react';
import { render } from '@testing-library/react';
import { isConformant } from '../../testing/isConformant';
import { ResizablePanel } from './ResizablePanel';

describe('ResizablePanel', () => {
  isConformant({
    Component: ResizablePanel,
    displayName: 'ResizablePanel',
  });

  // TODO add more tests here, and create visual regression tests in /apps/vr-tests

  it('renders a default state', () => {
    const result = render(<ResizablePanel>Default ResizablePanel</ResizablePanel>);
    expect(result.container).toMatchSnapshot();
  });
});
