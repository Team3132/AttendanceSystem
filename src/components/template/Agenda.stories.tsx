import { ComponentMeta, ComponentStory } from "@storybook/react";
import { rest } from "msw";
import { withRouter } from "storybook-addon-react-router-v6";
import { AuthStatusDto, Event, Rsvp, User } from "../../generated";
import SWRConfigWithFetcher from "../SWRProviderWithFetcher";
import Agenda from "./Agenda";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Template/Agenda",
  component: Agenda,
  decorators: [withRouter],

  args: {},
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Agenda>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Agenda> = (args) => (
  <SWRConfigWithFetcher>
    <Agenda {...args} />
  </SWRConfigWithFetcher>
);

export const Default = Template.bind({});

Default.parameters = {
  msw: {
    handlers: [
      rest.get<Event[]>("https://api.team3132.com/event", (req, res, ctx) => {
        return res(
          ctx.delay(500),
          ctx.json([
            {
              id: "cl6def3iu001401n0t7f9zlj6",
              description: "",
              title: "test",
              allDay: false,
              startDate: "2022-08-16T14:00:00.000Z",
              endDate: "2022-08-17T14:00:00.000Z",
            },
          ])
        );
      }),
      rest.get<AuthStatusDto>(
        "https://api.team3132.com/auth/status",
        (req, res, ctx) => {
          return res(
            ctx.delay(500),
            ctx.json({ isAuthenticated: true, roles: [], isAdmin: true })
          );
        }
      ),
      rest.get<User>("https://api.team3132.com/user/me", (req, res, ctx) => {
        return res(
          ctx.json({
            id: "201596915702300673",
            firstName: "Sebastian",
            lastName: "Pietschner",
            createdAt: "2022-07-13T11:53:17.505Z",
            updatedAt: "2022-08-14T05:47:45.969Z",
            discordRefreshToken: "DaIV2hmedxF41yNOpVcQqIsIVbN21f",
            calendarSecret: "eeef7845-e0a4-49ca-b7aa-96e57c478345",
            email: "sebasptsch@gmail.com",
          })
        );
      }),
      rest.get<Rsvp>(
        "https://api.team3132.com/event/cl6def3iu001401n0t7f9zlj6/rsvp",
        (req, res, ctx) => {
          return res(
            ctx.json([
              {
                id: "cl6e8xli1007901n0urez45vh",
                eventId: "cl6def3iu001401n0t7f9zlj6",
                userId: "201596915702300673",
                status: "YES",
                createdAt: "2022-08-03T23:34:30.937Z",
                updatedAt: "2022-08-03T23:41:32.665Z",
              },
            ])
          );
        }
      ),
      rest.post<Rsvp>(
        "https://api.team3132.com/event/cl6def3iu001401n0t7f9zlj6/rsvp",
        async (req, res, ctx) => {
          return res(
            ctx.json([
              {
                id: "cl6e8xli1007901n0urez45vh",
                eventId: "cl6def3iu001401n0t7f9zlj6",
                userId: "201596915702300673",
                status: (await req.json()).status,
                createdAt: "2022-08-03T23:34:30.937Z",
                updatedAt: "2022-08-03T23:41:32.665Z",
              },
            ])
          );
        }
      ),
    ],
  },
};

Default.args = {};

// More on args: https://storybook.js.org/docs/react/writing-stories/args
// Primary.args = {
//   children: "Button",
//   size: ""
// };

// export const Large = Template.bind({});
// Large.args = {
//   size: "lg",
//   children: "Button",
// };

// export const Small = Template.bind({});
// Small.args = {
//   size: "sm",
// };
