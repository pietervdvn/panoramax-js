import {FeatureService, ICollection, IGetCollectionsResponse, ILink} from "@ogcapi-js/features";
import {Feature, Point} from "geojson";

export interface Extent {
    spatial: {
        bbox: [number, number, number, number]
    }
    temporal: {
        interval: [Date, Date]
    }
}

export interface Sequence extends ICollection {
    created: Date,
    description: string | "A sequence of geolocated pictures",
    extent: Extent,
    keywords?: string[],
    license: string,
    /**
     * The contributor who made this sequence
     */
    providers: { id: string, name: string, roles: (string | "producer")[] }[],
    stac_extensions: string[],
    stac_version: string,
    "stats:items": { count: number },
    type: "Collection",
    updated: Date
}


export class Panoramax {
    private _url: string;

    constructor(url: string = "https://panoramax.openstreetmap.fr/") {
        if (!url.endsWith("/")) {
            url += "/"
        }
        if (!url.endsWith("api/")) {
            url += "api/"
        }
        this._url = url;
        new URL(url) // Validate the URL
    }

    public async fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
        const res = await fetch(url, init);

        if (!res.ok) {
            throw new Error(res.statusText);
        }

        return <T>await res.json();
    }

    /**
     * Downloads information about all image sequences.
     * Note that the actual downloads are done in smaller batches
     */
    public async* sequences(): AsyncIterableIterator<Sequence> {
        const service = new FeatureService({
            baseUrl: this._url
        });
        const collections = await service.getCollections();
        for (const collection of collections.collections) {
            yield <Sequence>collection
        }
        let next = collections.links.find(l => l.rel === "next")
        while (next) {
            const collections = await this.fetchJson<IGetCollectionsResponse>(next.href);
            for (const collection of (collections?.collections ?? [])) {
                yield <Sequence>collection
            }
            next = collections?.links?.find(l => l.rel === "next")
        }
    }

    public url(...endpoint: string[]) {
        return this._url + endpoint.join("/") + "/"
    }

    /***
     The response contains the JWT token, and this token can be saved, but won't be usable until someone claims it with /auth/tokens/claims/:id

     The response contains the claim route as a link with rel=claim
     */
    public async generateToken(description: string) {
        return this.fetchJson<Token>(this.url("auth", "tokens", "generate") + "?description=" + encodeURIComponent(description), {
            method: "POST",
        })
    }

}

interface Token {
    "description": "string",
    "generated_at": "string",
    "id": "string",
    "jwt_token": "string",
    "links": [
        {
            "href": "string",
            "ref": "string",
            "type": "string"
        }
    ]
}

export class AuthorizedPanoramax extends Panoramax {
    private _bearerToken: string;


    /**
     * To get a bearer token, go to your panoramax instance > settings and copy the token
     * @param url
     * @param bearerToken
     */
    constructor(url: string, bearerToken: string) {
        super(url);
        this._bearerToken = bearerToken;
    }

    public async fetch(url: string, init: RequestInit | undefined = undefined) {
        init ??= <RequestInit>{}
        let headers: Record<string, string> = <any>init?.headers ?? {}
        headers["Authorization"] = "Bearer " + this._bearerToken
        init.headers = headers
        return await fetch(url, init)
    }

    async fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
        const res = await this.fetch(url, init);

        if (!res.ok) {
            throw new Error(res.statusText);
        }

        return <T>await res.json();
    }

    public async createCollection(title?: string): Promise<ICollection> {
        return this.fetchJson(this.url("collections"), {
            method: "POST",
            body: JSON.stringify({title})
        })
    }

    /**
     *  Gets (the links to) all the sequences that were created by the currently logged in user.
     *  All returned links will have `rel === "child"`
     */
    public async mySequences(): Promise<(ILink & { id: string, extent: Extent, "stats:items": { count: number } })[]> {
        const collection = await this.fetchJson<IGetCollectionsResponse>(this.url("users", "me", "collection"))
        return <any>collection.links.filter(l => l.rel === "child")
    }

    public async addImage(image: File, sequence: {
        id: string,
        "stats:items": { count: number }
    }, options?: {
        datetime?: string,
        lon?: number, // WGS84
        lat?: number, // WGS84
        exifOverride?: Record<string, string>
    }): Promise<Feature<Point> & {id: string}> {
        let seqId: string
        if (typeof sequence !== "string") {
            seqId = sequence.id
        } else {
            seqId = sequence
        }

        const body = new FormData()
        body.append("isBlurred","false")
        const position = sequence["stats:items"].count + 1 // position starts from 1
        body.append("position", ""+position)
        if(options?.lat){
            body.append("override_latitude", ""+options.lat )
        }
        if(options?.lon){
            body.append("override_longitude", ""+options.lon )
        }
        if(options?.datetime){
            body.append("override_capture_time", ""+options.datetime )
        }
        for (const key in options?.exifOverride ?? {}) {
            const value = options?.exifOverride?.[key]
            if(value){
                body.append("override_Exif.Image."+key, value)
            }
        }
        body.append("picture", image)

        return this.fetchJson(this.url("collections", seqId, "items"), {
            method: "POST",
            body
        })

    }

}