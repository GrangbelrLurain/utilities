import React from 'react';

import ButtonBack from '@Shared/ui/buttons/ButtonBack';
import { useRouter } from 'next/router';
import { FaGithub } from 'react-icons/fa';
import { BiHomeAlt2 } from 'react-icons/bi';
import Link from 'next/link';

export function MainHeader() {
  const { back, pathname } = useRouter();

  return (
    <header className="mx-auto max-w-screen-xl w-full py-2">
      <div className="mx-auto max-w-screen-xl w-full flex justify-end">
        <Link href="https://github.com/GrangbelrLurain/utilities">
          <FaGithub size={24} />
        </Link>
      </div>
      <div className="mx-auto max-w-screen-xl w-full flex items-center justify-start">
        {pathname !== '/' && (
          <>
            <ButtonBack onClick={back} />
            <Link className="btn btn-ghost" href="/">
              <BiHomeAlt2 size={24} />
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
