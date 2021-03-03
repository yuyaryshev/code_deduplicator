import { AckPacket } from "../types/common.types";
import { anyJson, boolean, Decoder, object, optional, string } from "@mojotech/json-type-validation";

//----------------------------------------------------------------------------------------------------
export interface OneGetApiRequest {
    //    q: string;
}
export const decoderOneGetApiRequest: Decoder<OneGetApiRequest> = object({
    //    q: string(),
});

export interface OneGetApiResponse extends AckPacket {
    data: any;
    dataVersion: string;
    // persons: SerializedPerson[];
    // totalCount: number;
}
export const decoderOneGetApiResponse: Decoder<OneGetApiResponse> = object({
    ok: boolean(),
    error: optional(string()),
    dataVersion: string(),
    data: anyJson(),
});
//----------------------------------------------------------------------------------------------------
export interface OneSaveApiRequest {
    data: any;
    prevDataVersion: string;
    newDataVersion: string;
}
export const decoderOneSaveApiRequest: Decoder<OneSaveApiRequest> = object({
    data: anyJson(),
    prevDataVersion: string(),
    newDataVersion: string(),
});

export interface OneSaveApiResponse extends AckPacket {}
export const decoderOneSaveApiResponse: Decoder<OneSaveApiResponse> = object({
    ok: boolean(),
    error: optional(string()),
});
//----------------------------------------------------------------------------------------------------
