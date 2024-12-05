import { render } from '@testing-library/react';
import { createMockUser } from '@/schemas/user';

import SomePresentational from './somePresentational';

test('데이터 랜더링 테스트', () => {
  const user = createMockUser(1);

  const { queryByText } = render(<SomePresentational user={user} />);

  // ASSERT
  expect(queryByText(user.name)).toBeInTheDocument();
  expect(queryByText(user.id.toString())).toBeNull();
  expect(queryByText(user.email)).toBeInTheDocument();
  expect(queryByText(user.age.toString())).toBeInTheDocument();
});
