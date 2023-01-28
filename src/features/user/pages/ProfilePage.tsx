import { RoleTag } from "@/features/bot";
import {
  Button,
  Center,
  Container,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
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

interface OnSubmitData {
  defaultStatus?: UpdateUserDto.defaultStatus | "";
}

export const ProfileScreen: React.FC = () => {
  const { userId } = useParams();
  const { data: user } = useUser(userId);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<OnSubmitData>();

  useEffect(() => {
    if (user) {
      reset({
        defaultStatus: user.defaultStatus === null ? "" : user.defaultStatus,
      });
    }
  }, [user]);

  const { mutateAsync: mutateUser } = useUpdateUser();

  const onSubmit = (data: OnSubmitData) => {
    const userIdent = userId ?? "me";
    return mutateUser({
      id: userIdent,
      user: {
        ...data,
        defaultStatus: data.defaultStatus === "" ? null : data.defaultStatus,
      },
    });
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

      <Heading textAlign={"center"}>{user?.username}</Heading>
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
            <FormControl isInvalid={!!errors.defaultStatus}>
              <FormLabel htmlFor="firstName">Default RSVP Status</FormLabel>
              <Select
                id="firstName"
                {...register("defaultStatus")}
                variant={"filled"}
                placeholder="No option"
              >
                <option value={UpdateUserDto.defaultStatus.MAYBE}>Maybe</option>
                <option value={UpdateUserDto.defaultStatus.YES}>Yes</option>
                <option value={UpdateUserDto.defaultStatus.NO}>No</option>
              </Select>
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
            <FormHelperText>
              If you give this link to Google Calendar etc. it should show all
              the events.
            </FormHelperText>
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
