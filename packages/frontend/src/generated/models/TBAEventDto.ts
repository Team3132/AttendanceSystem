/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DistrictListDto } from "./DistrictListDto";

export type TBAEventDto = {
  key: string;
  name: string;
  event_code: string;
  event_type: number;
  district: DistrictListDto;
  city: string;
  state_prov: string;
  country: string;
  start_date: string;
  end_date: string;
  year: number;
  short_name: string;
  event_type_string: string;
  week: number;
  address: string;
  postal_code: string;
  gmaps_place_id: string;
  gmaps_url: string;
  lat: number;
  lng: number;
  location_name: string;
  timezone: string;
  website: string;
  first_event_id: string;
  first_event_code: string;
  webcasts: Array<string>;
  division_keys: Array<string>;
  parent_event_key: string;
  playoff_type: number;
  playoff_type_string: string;
};
