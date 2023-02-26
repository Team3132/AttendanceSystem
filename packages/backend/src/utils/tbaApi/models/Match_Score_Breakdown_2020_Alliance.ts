/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Match_Score_Breakdown_2020_Alliance = {
    initLineRobot1?: string;
    endgameRobot1?: string;
    initLineRobot2?: string;
    endgameRobot2?: string;
    initLineRobot3?: string;
    endgameRobot3?: string;
    autoCellsBottom?: number;
    autoCellsOuter?: number;
    autoCellsInner?: number;
    teleopCellsBottom?: number;
    teleopCellsOuter?: number;
    teleopCellsInner?: number;
    stage1Activated?: boolean;
    stage2Activated?: boolean;
    stage3Activated?: boolean;
    stage3TargetColor?: string;
    endgameRungIsLevel?: string;
    autoInitLinePoints?: number;
    autoCellPoints?: number;
    autoPoints?: number;
    teleopCellPoints?: number;
    controlPanelPoints?: number;
    endgamePoints?: number;
    teleopPoints?: number;
    shieldOperationalRankingPoint?: boolean;
    shieldEnergizedRankingPoint?: boolean;
    /**
     * Unofficial TBA-computed value that indicates whether the shieldEnergizedRankingPoint was earned normally or awarded due to a foul.
     */
    tba_shieldEnergizedRankingPointFromFoul?: boolean;
    /**
     * Unofficial TBA-computed value that counts the number of robots who were hanging at the end of the match.
     */
    tba_numRobotsHanging?: number;
    foulCount?: number;
    techFoulCount?: number;
    adjustPoints?: number;
    foulPoints?: number;
    rp?: number;
    totalPoints?: number;
};

