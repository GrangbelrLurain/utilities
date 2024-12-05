import { memo, useState } from "react";

import SomePresentational from "../presentationals/somePresentational";
import useUser from "@/hooks/useUser";
import clsx from "clsx";

const MemoizedSomePresentational = memo(SomePresentational);

const SomeContainer = () => {
  const { users, getUsers, isPending } = useUser();

  const [page, setPage] = useState(1);

  const handleClick = () => {
    setPage(page + 1);
    getUsers({ limit: "10", page: page.toString() });
  };

  return (
    <div
      className={clsx("pt-40 transition-opacity", isPending && "opacity-50")}
    >
      <button className="btn" onClick={handleClick}>
        click {page}
      </button>
      <ul className="grid grid-cols-9 gap-4">
        {users.map((user, index) => (
          <MemoizedSomePresentational key={index} user={user} />
        ))}
      </ul>
    </div>
  );
};

export default SomeContainer;
