import useUser from "../hooks/useUser";

interface UsernameProps {
  userId?: string;
}

export default function Username({ userId }: UsernameProps) {
  const { data: user, isLoading } = useUser(userId);
  return (
    <>
      {user?.firstName} {user?.lastName}
    </>
  );
}
