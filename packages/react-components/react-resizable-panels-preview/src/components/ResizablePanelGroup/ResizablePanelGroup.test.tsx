import * as React from 'react';
import { render } from '@testing-library/react';
import { isConformant } from '../../testing/isConformant';
import { ResizablePanelGroup } from './ResizablePanelGroup';

describe('ResizablePanelGroup', () => {
  isConformant({
    Component: ResizablePanelGroup,
    displayName: 'ResizablePanelGroup',
  });

  // TODO add more tests here, and create visual regression tests in /apps/vr-tests

  it('renders a default state', () => {
    const result = render(<ResizablePanelGroup>Default ResizablePanelGroup</ResizablePanelGroup>);
    expect(result.container).toMatchSnapshot();
  });
});
