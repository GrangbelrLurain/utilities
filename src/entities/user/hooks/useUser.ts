import { userStore } from '@Entities/user/stores/userStore';
import { useCallback, useTransition } from 'react';

export type TTestQuery = {
  limit?: string;
  page?: string;
};

const useUser = () => {
  const { users, setUsers } = userStore();

  const [isPending, startTransition] = useTransition();

  const getUsers = useCallback(
    (query: TTestQuery) => {
      const urlQuery = new URLSearchParams(query);

      startTransition(async () => {
        const res = await fetch(`/api/user?${urlQuery.toString()}`);
        const data = await res.json();
        setUsers(users.concat(...data));
      });
    },
    [users, setUsers],
  );

  return { users, getUsers, isPending };
};

export default useUser;
