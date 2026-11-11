/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import ShareMenu from 'react-native-share-menu';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

jest.mock('react-native-share-menu', () => ({
  getInitialShare: jest.fn(),
  addNewShareListener: jest.fn(() => ({remove: jest.fn()})),
}));

it('renders correctly', () => {
  renderer.act(() => {
    renderer.create(<App />);
  });
  expect(ShareMenu.getInitialShare).toHaveBeenCalled();
  expect(ShareMenu.addNewShareListener).toHaveBeenCalled();
});

it('displays an initial text share and removes its listener', () => {
  const remove = jest.fn();
  ShareMenu.getInitialShare.mockImplementationOnce(callback => callback({mimeType: 'text/plain', data: 'Hello'}));
  ShareMenu.addNewShareListener.mockReturnValueOnce({remove});

  let tree;
  renderer.act(() => {
    tree = renderer.create(<App />);
  });
  expect(JSON.stringify(tree.toJSON())).toContain('Hello');

  renderer.act(() => tree.unmount());
  expect(remove).toHaveBeenCalled();
});

it('ignores an empty iOS share on startup', () => {
  ShareMenu.getInitialShare.mockImplementationOnce(callback => callback({data: null}));

  renderer.act(() => {
    renderer.create(<App />);
  });
});

it('displays an iOS share and its extra data', () => {
  ShareMenu.getInitialShare.mockImplementationOnce(callback =>
    callback({data: [{mimeType: 'text/plain', data: 'Shared from iOS'}], extraData: {hello: 'world'}}),
  );

  let tree;
  renderer.act(() => {
    tree = renderer.create(<App />);
  });
  expect(JSON.stringify(tree.toJSON())).toContain('Shared from iOS');
  expect(JSON.stringify(tree.toJSON())).toContain('hello');
});
