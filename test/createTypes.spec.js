import createTypes from '../src/createTypes';

describe('createTypes', () => {
  it('should return an object with the respective action types', () => {
    const actionTypes = createTypes(['list', 'softDelete'], 'MY');

    expect(actionTypes).toEqual({
      list: 'MY_LIST',
      softDelete: 'MY_SOFT_DELETE',
    });
  });
});
