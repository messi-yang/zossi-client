import { useCallback, useContext, useEffect, useState } from 'react';
import type { NextPage, GetStaticProps } from 'next';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { UserContext } from '@/contexts/user-context';
import { Text } from '@/components/texts/text';
import { Field } from '@/components/fields/field';
import { Input } from '@/components/inputs/input';
import { Button } from '@/components/buttons/button';
import { UserModel } from '@/models/iam/user-model';
import { AuthContext } from '@/contexts/auth-context';

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

  const { signOut } = useContext(AuthContext);
  const handleLogoutClick = () => {
    signOut();
  };

  const handleEditUserClick = useCallback(() => {
    resetDraftUser(user);
    setIsEditingUser(true);
  }, [user]);

  const handleSaveUserClick = useCallback(async () => {
    if (!draftUser) return;

    await updateMyUser(draftUser.getUsername(), draftUser.getFriendlyName());
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

  const handleFriendlyNameInput = useCallback(
    (newFriendlyName: string) => {
      if (!draftUser) return;
      const clonedDraftUser = draftUser.clone();
      clonedDraftUser.setFriendlyName(newFriendlyName);
      setDraftUser(clonedDraftUser);
    },
    [draftUser]
  );

  return (
    <DashboardLayout
      panel={
        <div className="flex items-center justify-end">
          <Button text="Logout" onClick={handleLogoutClick} />
        </div>
      }
    >
      <main className="relative flex">
        <div className="w-full max-w-4xl flex flex-col">
          <Text size="text-xl">Account Information</Text>
          <div className="mt-5">
            <Field label="Email address">
              <Text size="text-base">{user?.getEmailAddress() || ''}</Text>
            </Field>
            <div className="mt-5">
              <Field label="Username">
                {!isEditingUser && <Text size="text-base">{user?.getUsername() || ''}</Text>}
                {isEditingUser && <Input value={draftUser?.getUsername() || ''} onInput={handleUsernameInput} />}
              </Field>
            </div>
            <div className="mt-5">
              <Field label="Friendly Name">
                {!isEditingUser && <Text size="text-base">{user?.getFriendlyName() || ''}</Text>}
                {isEditingUser && <Input value={draftUser?.getFriendlyName() || ''} onInput={handleFriendlyNameInput} />}
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
