import * as path from "path";
import { Env } from "../startApiServer";
import { dateDiff, debugMsgFactory as debugjs, newGuid, writeFileSerieSync, writeFileSyncIfChanged } from "Ystd";
import { Express } from "express";
import {
    decoderOneGetApiResponse,
    decoderOneSaveApiRequest,
    decoderOneSaveApiResponse,
    OneGetApiResponse,
    OneSaveApiResponse,
} from "../../api/oneApi";
import { readFileSync, writeFileSync } from "fs";

const debug = debugjs("oneApi");
const dataPath = "./data";
const dataFileName = "data.json";
const dataFilePath = path.join(dataPath, dataFileName);
const conflictsPath = path.join(dataPath, "conflicts");
const backupPath = path.join(dataPath, "backups");

function conflictsFilePath(skippedVersion: string): string {
    return path.join(conflictsPath, skippedVersion.split("-").join("") + "_" + dataFileName);
}

function backupFileName(ts: string): string {
    return ts.toString().split(":").join("-").split(" ").join("_") + "_" + dataFileName;
}

const BACKUP_INTERVAL = 1 * 60 * 60 * 1000;
const MAX_BACKUPS = 500;

export function publishOneApis(env: Env, app: Express) {
    app.get("/api/one", async function personOneGetApi(req, res) {
        const ts = new Date().toISOString();
        let error: string | undefined = "CODE00000101 Unknown error";
        let ok: boolean = false;

        try {
            //const { q } = decoderOneGetApiRequest.runWithException(req.query);
            // const persons = env.personModel.searchPersons(q);
            let parsed;
            try {
                const content = readFileSync("data.json", "utf-8");
                parsed = JSON.parse(content);
            } catch (e) {
                parsed = undefined;
            }

            if (!parsed?.data) {
                if (!parsed) parsed = {};
                parsed.data = {};
                parsed.dataVersion = newGuid();
                writeFileSync("data.json", JSON.stringify(parsed, undefined, "    "), "utf-8");
            }

            const { data, dataVersion } = parsed;

            return res.send(
                JSON.stringify(
                    decoderOneGetApiResponse.runWithException({
                        ok: true,
                        data,
                        dataVersion,
                    } as OneGetApiResponse)
                )
            );
        } catch (e) {
            error = "CODE00000202 " + e.message;
            console.error(error);
        }

        return res.send(
            JSON.stringify({
                ok: false,
                error,
            })
        );
    });

    app.post("/api/one", async function OneSaveApi(req, res) {
        const ts = new Date().toISOString();
        let error: string | undefined = "CODE00000104 Unknown error";
        let ok: boolean = false;

        try {
            let parsed;
            let oldContent: string | undefined;
            try {
                const oldContent = readFileSync("data.json", "utf-8");
                parsed = JSON.parse(oldContent);
            } catch (e) {
                parsed = undefined;
            }
            const { data: oldData, dataVersion: oldDataVersion } = parsed || { data: {}, dataVersion: newGuid() };

            if (oldContent && oldContent.length && dateDiff(parsed.ts, new Date()) > BACKUP_INTERVAL) {
                // BACKUP old files with specified interval
                const v_backupFileName = backupFileName(parsed.ts);
                writeFileSerieSync(backupPath, v_backupFileName, oldContent, MAX_BACKUPS);
            }

            const { data, prevDataVersion, newDataVersion } = decoderOneSaveApiRequest.runWithException(req.body);
            data.ts = new Date().toISOString();
            if (oldContent && oldContent.length && oldDataVersion !== prevDataVersion) {
                // Backup old data as a conflict missing version
                const v_conflictFilePath = conflictsFilePath(oldDataVersion);
                writeFileSyncIfChanged(v_conflictFilePath, oldContent);

                // log conflict into the data
                if (!data.versionConflicts) data.versionConflicts = [];
                data.versionConflicts.push({
                    actualPrev: oldDataVersion,
                    expectedPrev: prevDataVersion,
                    new: newDataVersion,
                });
            }

            const content = JSON.stringify(data, undefined, "    ");
            writeFileSyncIfChanged(dataFilePath, content);

            return res.send(
                JSON.stringify(
                    decoderOneSaveApiResponse.runWithException({
                        ok: true,
                    } as OneSaveApiResponse)
                )
            );
        } catch (e) {
            error = "CODE00000310 " + e.message;
            console.error(error);
        }

        return res.send(
            JSON.stringify({
                ok: false,
                error,
            })
        );
    });
}
