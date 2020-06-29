import { MQRC_ID_FILE_DESCRIPTION } from "../../consts";

export class FF {
    constructor() {
        this.mqrcList = {};
        // MQRC, содержащий информацию о файлах в псевдоархиве
        this.mqrcArchiveDescription = null;
    }

    setMQRCName(mqrcID, mqrcName) {
        this.mqrcList[mqrcID].setName(mqrcName);
    }

    getMQRC(mqrcID) {
        return this.mqrcList[mqrcID];
    }

    getMQRCArchiveDescription() {
        return this.mqrcArchiveDescription;
    }

    addMQRCList(mqrcList) {
        mqrcList.forEach((mqrc) => {
            this.addMQRC(mqrc);
        })
    }

    addMQRC(mqrc) {
        if (mqrc.getID() === MQRC_ID_FILE_DESCRIPTION) {
            this.mqrcArchiveDescription = mqrc;
        } else {
            this.mqrcList[mqrc.getID()] = mqrc;
        }
    }
}
