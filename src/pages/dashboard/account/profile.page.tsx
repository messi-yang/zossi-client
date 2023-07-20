import { useCallback, useContext, useEffect, useState } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { UserContext } from '@/contexts/user-context';
import { Text } from '@/components/texts/text';
import { Field } from '@/components/fields/field';
import { Input } from '@/components/inputs/input';
import { Button } from '@/components/buttons/button';
import { UserModel } from '@/models';

const Page: NextPage = function Page() {
  const { user, getMyUser, updateMyUser, isUpdatingMyUser } = useContext(UserContext);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [draftUser, setDraftUser] = useState<UserModel | null>(null);

  const resetDraftUser = useCallback((_user: UserModel | null) => {
    setDraftUser(_user ? _user.clone() : null);
  }, []);

  useEffect(() => {
    getMyUser();
  }, []);

  const handleEditUserClick = useCallback(() => {
    resetDraftUser(user);
    setIsEditingUser(true);
  }, [user]);

  const handleSaveUserClick = useCallback(async () => {
    if (!draftUser) return;

    await updateMyUser(draftUser.getUsername());
    setIsEditingUser(false);
  }, [draftUser]);

  const handleCancelSaveClick = useCallback(() => {
    resetDraftUser(user);
    setIsEditingUser(false);
  }, [user]);

  const handleUsernameInput = useCallback(
    (newUsername: string) => {
      if (!draftUser) return;
      const clonedDraftUser = draftUser.clone();
      clonedDraftUser.setUsername(newUsername);
      setDraftUser(clonedDraftUser);
    },
    [draftUser]
  );

  return (
    <DashboardLayout>
      <main className="relative w-full h-full p-10 flex justify-center bg-[#1E1E1E]">
        <div className="w-full max-w-4xl flex flex-col">
          <Text size="text-xl">Account Information</Text>
          <div className="mt-5">
            <Field label="Email address">
              <Text color="text-white" size="text-base">
                {user?.getEmailAddress() || ''}
              </Text>
            </Field>
            <div className="mt-5">
              <Field label="Username">
                {!isEditingUser && (
                  <Text color="text-white" size="text-base">
                    {user?.getUsername() || ''}
                  </Text>
                )}
                {isEditingUser && <Input value={draftUser?.getUsername() || ''} onInput={handleUsernameInput} />}
              </Field>
            </div>
          </div>
          <div className="mt-8 flex">
            {!isEditingUser && <Button text="Edit" onClick={handleEditUserClick} />}
            {isEditingUser && (
              <>
                <Button text="Save" loading={isUpdatingMyUser} onClick={handleSaveUserClick} />
                {!isUpdatingMyUser && (
                  <div className="ml-3">
                    <Button text="Cancel" onClick={handleCancelSaveClick} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default Page;
