/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Match_Score_Breakdown_2016_Alliance = {
    autoPoints?: number;
    teleopPoints?: number;
    breachPoints?: number;
    foulPoints?: number;
    capturePoints?: number;
    adjustPoints?: number;
    totalPoints?: number;
    robot1Auto?: Match_Score_Breakdown_2016_Alliance.robot1Auto;
    robot2Auto?: Match_Score_Breakdown_2016_Alliance.robot2Auto;
    robot3Auto?: Match_Score_Breakdown_2016_Alliance.robot3Auto;
    autoReachPoints?: number;
    autoCrossingPoints?: number;
    autoBouldersLow?: number;
    autoBouldersHigh?: number;
    autoBoulderPoints?: number;
    teleopCrossingPoints?: number;
    teleopBouldersLow?: number;
    teleopBouldersHigh?: number;
    teleopBoulderPoints?: number;
    teleopDefensesBreached?: boolean;
    teleopChallengePoints?: number;
    teleopScalePoints?: number;
    teleopTowerCaptured?: number;
    towerFaceA?: string;
    towerFaceB?: string;
    towerFaceC?: string;
    towerEndStrength?: number;
    techFoulCount?: number;
    foulCount?: number;
    position2?: string;
    position3?: string;
    position4?: string;
    position5?: string;
    position1crossings?: number;
    position2crossings?: number;
    position3crossings?: number;
    position4crossings?: number;
    position5crossings?: number;
};

export namespace Match_Score_Breakdown_2016_Alliance {

    export enum robot1Auto {
        CROSSED = 'Crossed',
        REACHED = 'Reached',
        NONE = 'None',
    }

    export enum robot2Auto {
        CROSSED = 'Crossed',
        REACHED = 'Reached',
        NONE = 'None',
    }

    export enum robot3Auto {
        CROSSED = 'Crossed',
        REACHED = 'Reached',
        NONE = 'None',
    }


}

