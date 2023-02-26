/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Match_Score_Breakdown_2017_Alliance = {
    autoPoints?: number;
    teleopPoints?: number;
    foulPoints?: number;
    adjustPoints?: number;
    totalPoints?: number;
    robot1Auto?: Match_Score_Breakdown_2017_Alliance.robot1Auto;
    robot2Auto?: Match_Score_Breakdown_2017_Alliance.robot2Auto;
    robot3Auto?: Match_Score_Breakdown_2017_Alliance.robot3Auto;
    rotor1Auto?: boolean;
    rotor2Auto?: boolean;
    autoFuelLow?: number;
    autoFuelHigh?: number;
    autoMobilityPoints?: number;
    autoRotorPoints?: number;
    autoFuelPoints?: number;
    teleopFuelPoints?: number;
    teleopFuelLow?: number;
    teleopFuelHigh?: number;
    teleopRotorPoints?: number;
    kPaRankingPointAchieved?: boolean;
    teleopTakeoffPoints?: number;
    kPaBonusPoints?: number;
    rotorBonusPoints?: number;
    rotor1Engaged?: boolean;
    rotor2Engaged?: boolean;
    rotor3Engaged?: boolean;
    rotor4Engaged?: boolean;
    rotorRankingPointAchieved?: boolean;
    techFoulCount?: number;
    foulCount?: number;
    touchpadNear?: string;
    touchpadMiddle?: string;
    touchpadFar?: string;
};

export namespace Match_Score_Breakdown_2017_Alliance {

    export enum robot1Auto {
        UNKNOWN = 'Unknown',
        MOBILITY = 'Mobility',
        NONE = 'None',
    }

    export enum robot2Auto {
        UNKNOWN = 'Unknown',
        MOBILITY = 'Mobility',
        NONE = 'None',
    }

    export enum robot3Auto {
        UNKNOWN = 'Unknown',
        MOBILITY = 'Mobility',
        NONE = 'None',
    }


}

