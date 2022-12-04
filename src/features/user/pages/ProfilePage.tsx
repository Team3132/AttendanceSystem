import { RoleTag } from "@/features/bot";
import {
  Button,
  Center,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  useClipboard,
  Wrap,
} from "@chakra-ui/react";
import { UpdateUserDto } from "@generated";
import loadable from "@loadable/component";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import UserAvatar from "../components/UserAvatar";
import useUpdateUser from "../hooks/useUpdateUser";
import useUser from "../hooks/useUser";

const OutreachReportLoadable = loadable(
  () => import("../components/OutreachReport")
);

export const ProfileScreen: React.FC = () => {
  const { userId } = useParams();
  const { data: user } = useUser(userId);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<UpdateUserDto>();

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
      });
    }
  }, [user]);

  const { mutateAsync: mutateUser } = useUpdateUser();

  const onSubmit = (data: UpdateUserDto) => {
    const userIdent = userId ?? "me";

    return mutateUser({ id: userIdent, user: data });
  };

  const calendarUrl = `https://api.team3132.com/calendar?secret=${
    user?.calendarSecret ?? ""
  }`;

  const { hasCopied, onCopy } = useClipboard(calendarUrl);
  return (
    <Container>
      <Center>
        <UserAvatar size={"2xl"} userId={userId} />
      </Center>

      <Heading textAlign={"center"}>
        {user?.firstName} {user?.lastName}
      </Heading>
      <Wrap justify={"center"} marginY={5}>
        {user?.roles?.map((role) => (
          <RoleTag key={role} roleId={role} colorScheme={"blue"}>
            {role}
          </RoleTag>
        ))}
      </Wrap>

      <Divider my={6} />

      <OutreachReportLoadable userId={userId} />
      <Divider my={6} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <HStack>
            <FormControl isInvalid={!!errors.firstName}>
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <Input
                id="firstName"
                placeholder="First Name"
                {...register("firstName", { required: true })}
                variant={"filled"}
              />
            </FormControl>
            <FormControl isInvalid={!!errors.lastName}>
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <Input
                id="lastName"
                placeholder="Last Name"
                {...register("lastName", { required: true })}
                variant={"filled"}
              />
            </FormControl>
          </HStack>

          <FormControl>
            <FormLabel htmlFor="calendar">Calendar Link</FormLabel>
            <Flex mb={2}>
              <Input
                value={calendarUrl}
                isReadOnly
                id="calendar"
                variant={"filled"}
              />
              <Button onClick={onCopy} ml={2}>
                {hasCopied ? "Copied" : "Copy"}
              </Button>
            </Flex>
          </FormControl>
          <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>
            Save
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default ProfileScreen;
