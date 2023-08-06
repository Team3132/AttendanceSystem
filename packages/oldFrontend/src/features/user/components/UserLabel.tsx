import { Avatar, AvatarBadge, HStack, Text } from "@chakra-ui/react";

interface UserlabelProps {
  avatarSrc?: string;
  name: string;
  badge?: "Offline" | "Online" | "Unknown";
  size?: "sm" | "md" | "lg" | "xl";
  status?: string;
}

const UserLabel: React.FC<UserlabelProps> = ({
  avatarSrc,
  name,
  badge,
  size = "md",
  status,
}) => {
  const textSize =
    size === "sm" ? "md" : size === "md" ? "lg" : size === "lg" ? "xl" : "2xl";
  return (
    <HStack>
      <Avatar src={avatarSrc} name={name} size={size}>
        {badge ? (
          <AvatarBadge
            boxSize={"1.25em"}
            bg={
              badge === "Offline"
                ? "yellow.500"
                : badge === "Unknown"
                ? "gray.500"
                : "green.500"
            }
          />
        ) : null}
      </Avatar>
      <Text
        fontWeight={"semibold"}
        fontSize={textSize}
        textTransform="capitalize"
        color="gray.600"
      >
        {name}
      </Text>
      {status ? (
        <Text fontWeight={"semibold"} fontSize={textSize} color="gray.600">
          ({status})
        </Text>
      ) : null}
    </HStack>
  );
};

export default UserLabel;
