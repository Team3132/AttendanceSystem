import { Box, Divider, Heading, Skeleton } from "@chakra-ui/react";

const SkeletonScreen: React.FC = () => {
  return (
    <>
      <Skeleton>
        <Heading textAlign={"center"} mt={6}>
          Agenda
        </Heading>
      </Skeleton>
      <Divider my={6} />
      <Skeleton>
        <Box width="100%" height="500px" />
      </Skeleton>
    </>
  );
};
export default SkeletonScreen;
