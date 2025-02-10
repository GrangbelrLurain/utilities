import { createMockUser } from './user';

describe('User', () => {
  it('should create a user', () => {
    const user = createMockUser(1);
    expect(user).toBeDefined();
  });
});
