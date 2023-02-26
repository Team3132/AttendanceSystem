/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Match_Score_Breakdown_2018_Alliance = {
    adjustPoints?: number;
    autoOwnershipPoints?: number;
    autoPoints?: number;
    autoQuestRankingPoint?: boolean;
    autoRobot1?: string;
    autoRobot2?: string;
    autoRobot3?: string;
    autoRunPoints?: number;
    autoScaleOwnershipSec?: number;
    autoSwitchAtZero?: boolean;
    autoSwitchOwnershipSec?: number;
    endgamePoints?: number;
    endgameRobot1?: string;
    endgameRobot2?: string;
    endgameRobot3?: string;
    faceTheBossRankingPoint?: boolean;
    foulCount?: number;
    foulPoints?: number;
    rp?: number;
    techFoulCount?: number;
    teleopOwnershipPoints?: number;
    teleopPoints?: number;
    teleopScaleBoostSec?: number;
    teleopScaleForceSec?: number;
    teleopScaleOwnershipSec?: number;
    teleopSwitchBoostSec?: number;
    teleopSwitchForceSec?: number;
    teleopSwitchOwnershipSec?: number;
    totalPoints?: number;
    vaultBoostPlayed?: number;
    vaultBoostTotal?: number;
    vaultForcePlayed?: number;
    vaultForceTotal?: number;
    vaultLevitatePlayed?: number;
    vaultLevitateTotal?: number;
    vaultPoints?: number;
    /**
     * Unofficial TBA-computed value of the FMS provided GameData given to the alliance teams at the start of the match. 3 Character String containing `L` and `R` only. The first character represents the near switch, the 2nd the scale, and the 3rd the far, opposing, switch from the alliance's perspective. An `L` in a position indicates the platform on the left will be lit for the alliance while an `R` will indicate the right platform will be lit for the alliance. See also [WPI Screen Steps](https://wpilib.screenstepslive.com/s/currentCS/m/getting_started/l/826278-2018-game-data-details).
     */
    tba_gameData?: string;
};

