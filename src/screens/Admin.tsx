import { UserList } from "@/components";
import RoleList from "@/components/organism/RoleList";
import { useUsers } from "@/hooks";
import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

export const AdminScreen: React.FC = () => {
  const { users, isLoading } = useUsers();
  return (
    <>
      <Heading textAlign={"center"} my={6}>
        Admin
      </Heading>
      <Tabs isLazy>
        <TabList justifyContent={"center"}>
          <Tab>User List</Tab>

          <Tab>Role List</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <UserList users={users} isLoading={isLoading} />
          </TabPanel>
          <TabPanel>
            <RoleList />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
export default AdminScreen;
