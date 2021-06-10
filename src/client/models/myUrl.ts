import { parse } from "query-string";

export function apiUrl(): string {
    const t1 = window.location.origin.split("://");
    const t2 = t1[1].split(":");
    return t1[0] + "://" + t2[0] + ":4300";
}

export function surveyIdFromUrl(): string {
    const parsed: any = parse(location.search);
    console.log("surveyIdFromUrl=", surveyIdFromUrl);
    return parsed.id;
}
