import * as React from 'react';
import { render } from '@testing-library/react';
import { isConformant } from '../../testing/isConformant';
import { ResizablePanelHandle } from './ResizablePanelHandle';

describe('ResizablePanelHandle', () => {
  isConformant({
    Component: ResizablePanelHandle,
    displayName: 'ResizablePanelHandle',
  });

  // TODO add more tests here, and create visual regression tests in /apps/vr-tests

  it('renders a default state', () => {
    const result = render(<ResizablePanelHandle>Default ResizablePanelHandle</ResizablePanelHandle>);
    expect(result.container).toMatchSnapshot();
  });
});
