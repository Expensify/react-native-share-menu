import 'react-native';
import React from 'react';
import Share from '../Share';
import {ShareMenuReactView} from 'react-native-share-menu';
import renderer from 'react-test-renderer';

jest.mock('react-native-share-menu', () => ({
  ShareMenuReactView: {
    data: jest.fn(),
    dismissExtension: jest.fn(),
    continueInApp: jest.fn(),
  },
}));

it('displays the first item from the iOS share payload', async () => {
  ShareMenuReactView.data.mockResolvedValue({data: [{mimeType: 'text/plain', data: 'Shared text'}]});

  let tree;
  await renderer.act(async () => {
    tree = renderer.create(<Share />);
  });

  expect(JSON.stringify(tree.toJSON())).toContain('Shared text');
});

it('handles an empty share payload', async () => {
  ShareMenuReactView.data.mockResolvedValue({data: []});

  await renderer.act(async () => {
    renderer.create(<Share />);
  });
});
