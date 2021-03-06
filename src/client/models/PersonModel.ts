import { PersonType, PersonTypeValues, SerializedPerson } from "../../domains/index.js";
import { copyPrimitiveFields, syncArray } from "./common.js";
import { v4 as newId } from "uuid";
import { addEdited, hasEdited, withDisabledAddEdited } from "./edited.js";
import { apiUrl } from "./myUrl.js";
import { notificationError } from "../notifications.js";
//import { notifyChanges } from "./MainModel";
import { Editable, ymeta } from "./ymeta.js";
import { mainModel } from "./MainModel.js";

const REFRESH_CURRENT_PERSONS_INTERVAL = undefined; // 999999 * 60 * 60 * 1000;

export class PersonModel implements Editable {
    // GRP_person_fields
    id: number = 0;
    uid: string = newId();
    @ymeta({ et: "string" }) name: string = "";
    @ymeta({ et: "enum", values: PersonTypeValues, defaultValue: "other" }) type: PersonType | undefined;
    @ymeta({ et: "string", multiline: true }) description: string = "";

    constructor() {
        const pthis = this;
    }

    getTitle() {
        return this.name;
    }

    setData(data: SerializedPerson) {
        copyPrimitiveFields(this, data);
        // syncArray(this.items, data.items, () => new SurveyQuestionModel());
    }
}

if ((module as any).hot) {
    (module as any).hot.accept();
}
