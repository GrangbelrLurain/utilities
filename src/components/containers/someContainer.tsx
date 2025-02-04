import { memo, useState } from 'react';

import useUser from '@/hooks/useUser';
import clsx from 'clsx';
import SomePresentational from '../presentationals/somePresentational';

const MemoizedSomePresentational = memo(SomePresentational);

function SomeContainer() {
  const { users, getUsers, isPending } = useUser();

  const [page, setPage] = useState(1);

  const handleClick = () => {
    setPage(page + 1);
    getUsers({ limit: '10', page: page.toString() });
  };

  return (
    <div className={clsx('transition-opacity', isPending && 'opacity-50')}>
      <button className="btn" onClick={handleClick} type="button">
        click {page}
      </button>
      <ul className="grid grid-cols-9 gap-4">
        {users.map((user) => (
          <MemoizedSomePresentational key={user.id} user={user} />
        ))}
      </ul>
    </div>
  );
}

export default SomeContainer;
