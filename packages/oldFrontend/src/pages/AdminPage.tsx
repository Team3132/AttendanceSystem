import { RoleList } from "@/features/bot";
import { UserList } from "@/features/user";
import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

export default function AdminPage() {
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
            <UserList />
          </TabPanel>
          <TabPanel>
            <RoleList />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
