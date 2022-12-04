import { Avatar, AvatarProps } from "@chakra-ui/react";
import useAvatar from "../hooks/useAvatar";
import useUser from "../hooks/useUser";

export type UserAvatarProps = {
  userId?: string;
} & Omit<Omit<AvatarProps, "src">, "name">;

export const UserAvatar: React.FC<UserAvatarProps> = ({ userId, ...rest }) => {
  const { data: avatarId } = useAvatar(userId);
  const { data: user } = useUser(userId);
  return (
    <Avatar
      src={
        user && avatarId
          ? `https://cdn.discordapp.com/avatars/${user?.id}/${avatarId}.png`
          : undefined
      }
      name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
      bgColor="transparent"
      {...rest}
    />
  );
};
export default UserAvatar;
