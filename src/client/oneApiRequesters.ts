import axios from "axios";
import { decoderOneGetApiResponse, decoderOneSaveApiResponse, OneGetApiRequest, OneSaveApiRequest } from "../api/index.js";
import { notificationError } from "./notifications.js";
import { addEdited, EditedObjects } from "./models/edited.js";
import { PersonModel } from "./models/PersonModel.js";
import { apiUrl } from "./models/myUrl.js";
import { saveTasks, TaskModel } from "./models/TaskModel.js";

export async function oneGetApi() {
    try {
        const resp0 = await axios.get(apiUrl() + "/api/one", { params: {} as OneGetApiRequest });
        const { data } = decoderOneGetApiResponse.runWithException(resp0?.data);
        return data;
    } catch (e) {
        console.error(`CODE00000309 ERROR in refreshCurrentTasks ${e.message}`);
    }
}

export async function oneSaveApi(data: any) {
    try {
        const resp0 = await axios.post(apiUrl() + "/api/one", { params: { data } as OneSaveApiRequest });
        const response = decoderOneSaveApiResponse.runWithException(resp0?.data);
        if (!response.ok) throw new Error("CODE00000200 Server error: " + response.error);
    } catch (e) {
        console.error(`CODE00000100 ERROR in refreshCurrentTasks ${e.message}`);
    }
}
