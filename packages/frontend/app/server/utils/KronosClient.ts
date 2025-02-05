import { z } from "zod";

const ScheduleStatusSchema = z.enum([
  "not_started",
  "active",
  "paused",
  "expired",
]);

export const ScheduleSchema = z.object({
  id: z.number(),
  title: z.string(),
  status: ScheduleStatusSchema,
  description: z.string(),
  cronExpr: z.string().optional(),
  url: z.string(),
  metadata: z.record(z.string()),
  isRecurring: z.boolean(),
  createdAt: z.string(),
  runAt: z.string(),
  startAt: z.string(),
  endAt: z.string(),
});

type Schedule = z.infer<typeof ScheduleSchema>;

const NewScheduleSchema = ScheduleSchema.partial().omit({
  id: true,
  status: true,
  createdAt: true,
});

type NewSchedule = z.infer<typeof NewScheduleSchema>;

/**
 * Kronos API client
 */
export default class KronosClient {
  private readonly kronosURL: string;

  constructor(kronosURL: string) {
    this.kronosURL = kronosURL;
  }

  /**
   * Create a new schedule
   * @param params The parameters to create a new schedule
   * @returns The created schedule
   **/
  async createSchedule(params: NewSchedule): Promise<Schedule> {
    const response = await fetch(`${this.kronosURL}/api/v1/schedules`, {
      method: "POST",
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const textResponse = await response.text();
      throw new Error(`Error creating Kronos job: ${textResponse}`);
    }

    return response.json();
  }

  /**
   * Delete a schedule by its Id
   * @param id The Id of the schedule
   * @returns The schedule
   */
  async deleteSchedule(id: number): Promise<Schedule> {
    const response = await fetch(`${this.kronosURL}/api/v1/schedules/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Error deleting Kronos job");
    }

    return response.json();
  }

  /**
   * Get a schedule by its Id
   * @param id The Id of the schedule
   * @returns The schedule
   */
  async getSchedule(id: number): Promise<Schedule> {
    const response = await fetch(`${this.kronosURL}/api/v1/schedules/${id}`);

    if (!response.ok) {
      const responseText = await response.text();

      throw new Error(`Error getting Kronos job ${responseText}`);
    }

    return response.json() as Promise<Schedule>;
  }

  /**
   * Pause a schedule
   * @param id The Id of the schedule
   * @returns The schedule
   */
  async pauseSchedule(id: number): Promise<Schedule> {
    const response = await fetch(
      `${this.kronosURL}/api/v1/schedules/${id}/pause`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      throw new Error("Error pausing Kronos job");
    }

    return response.json();
  }

  async resumeSchedule(id: number): Promise<Schedule> {
    const response = await fetch(
      `${this.kronosURL}/api/v1/schedules/${id}/resume`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      throw new Error("Error resuming Kronos job");
    }

    return response.json();
  }

  async triggerSchedule(id: number): Promise<Schedule> {
    const response = await fetch(
      `${this.kronosURL}/api/v1/schedules/${id}/trigger`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      const message = await response.text();

      throw new Error(`Error triggering Kronos job: ${message}`);
    }

    return response.json();
  }
}
