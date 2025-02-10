import { createMockUser } from '@Entities/user/schemas/user';
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/user', ({ request }) => {
    const url = new URL(request.url);
    const { limit = '10', page = '1' } = Object.fromEntries(url.searchParams);

    return HttpResponse.json(
      Array.from({ length: Number(limit) }, (_, index) => {
        const nowIndex = index + Number(page) * Number(limit);
        return createMockUser(nowIndex);
      }),
    );
  }),
];
