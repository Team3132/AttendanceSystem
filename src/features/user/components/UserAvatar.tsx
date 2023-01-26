import { Avatar, AvatarProps } from "@chakra-ui/react";
import useAvatar from "../hooks/useAvatar";
import useUser from "../hooks/useUser";

export interface UserAvatarProps extends Omit<AvatarProps, "src" | "name"> {
  userId?: string;
}

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
      name={user?.username}
      bgColor="transparent"
      {...rest}
    />
  );
};
export default UserAvatar;
