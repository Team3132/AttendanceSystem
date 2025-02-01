export interface Schedule {
  id: string;
  title: string;
  status: ScheduleStatus;
  description: string;
  cronExpr?: string;
  url: string;
  metadata: Record<string, string>;
  isRecurring: boolean;
  createdAt: string;
  runAt: string;
  startAt: string;
  endAt: string;
}

export type ScheduleStatus = "not_started" | "active" | "paused" | "expired";

export type NewSchedule = Omit<
  Partial<Schedule>,
  "id" | "status" | "createdAt"
>;

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
  async deleteSchedule(id: string): Promise<Schedule> {
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
  async getSchedule(id: string): Promise<Schedule> {
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
  async pauseSchedule(id: string): Promise<Schedule> {
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

  async resumeSchedule(id: string): Promise<Schedule> {
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

  async triggerSchedule(id: string): Promise<Schedule> {
    const response = await fetch(
      `${this.kronosURL}/api/v1/schedules/${id}/trigger`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      throw new Error("Error triggering Kronos job");
    }

    return response.json();
  }
}
