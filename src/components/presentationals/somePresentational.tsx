import { User } from "@/schemas/user";

const SomePresentational = ({ user }: { user: User }) => {
  return (
    <li className="flex flex-col gap-2 h-max items-start bg-primary rounded-lg p-4 whitespace-nowrap overflow-hidden text-ellipsis text-white">
      <p>{user.name}</p>
      <p>{user.age}</p>
      <p className="text-ellipsis">{user.email}</p>
    </li>
  );
};

export default SomePresentational;
