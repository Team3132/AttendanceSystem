import { Divider, Heading, Skeleton } from "@chakra-ui/react";

const SkeletonScreen: React.FC = () => {
  return (
    <>
      <Heading textAlign={"center"} mt={6}>
        <Skeleton>Skeleton</Skeleton>
      </Heading>

      <Divider my={6} />
    </>
  );
};
export default SkeletonScreen;
