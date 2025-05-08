import {FeatureService, ICollection, IGetCollectionsResponse, ILink} from "@ogcapi-js/features";
import {Feature, FeatureCollection, Point} from "geojson";

export interface Extent {
    spatial: {
        bbox: [number, number, number, number]
    }
    temporal: {
        interval: [Date, Date]
    }
}

export interface AssetLink {
    description: string,
    roles: string[],
    href: string;
    /**
     * link type
     */
    type: string;
    /**
     * link title
     */
    title: string;

}

export type ImageData =
    Feature<Point, {
        created?: string,
        license?: string,
        datetime?: string,
        datetimetz?: string,
        "geovisio:image"?: string,
        "geovisio:producer": string,
        "geovisio:license": string,
        "geovisio:thumbnail": string,
        "original_file:name": string,
        "original_file:size": number,
        /**
         * Compass direction
         */
        "view:azimuth": number,
        "geovisio:status": string | "ready" | "broken" | "preparing" | "waiting-for-process",
        exif: {
            [key: string]: string | undefined,
            "Exif.Image.Artist"?: string,
            "Xmp.GPano.ProjectionType"?: string | "equirectangular"
        }
    }>
    & {
    id: string,
    assets: { hd: AssetLink, sd: AssetLink, thumb: AssetLink },
    providers: { name: string }[],
    collection: string
}

/**
 * Properties of the pictures in the "map" endpoint
 */
export interface PictureProperties {

    id: string
    account_id: string
    /**
     * TimeStamp, probably an ISO-string
     */
    ts: string
    /**
     * COmpass angle in degrees
     */
    heading: number
    /**
     * list of sequences ID this pictures belongs to
     */
    sequences: string[]
    type: "flat" | "equirectangular"

    /**
     * camera make and model
     */
    model: string
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

export type SearchOptions = {


    /**
     * pointGeoJSON (object) or multipointGeoJSON (object) or linestringGeoJSON (object) or multilinestringGeoJSON (object) or polygonGeoJSON (object) or multipolygonGeoJSON (object) or geometrycollectionGeoJSON (object) (geometryGeoJSON)
     *
     * The optional intersects parameter filters the result Items in the same was as bbox, only with a GeoJSON Geometry rather than a bbox.
     */
    intersects?: Feature | FeatureCollection
    /**
     *
     * string
     *
     * Either a date-time or an interval, open or closed. Date and time expressions adhere to RFC 3339. Open intervals are expressed using double-dots.
     *
     * Examples:
     *
     *     A date-time: "2018-02-12T23:20:50Z"
     *     A closed interval: "2018-02-12T00:00:00Z/2018-03-18T12:31:12Z"
     *     Open intervals: "2018-02-12T00:00:00Z/.." or "../2018-03-18T12:31:12Z"
     *
     * Only features that have a temporal property that intersects the value of datetime are selected.
     *
     * If a feature has multiple temporal properties, it is the decision of the server whether only a single temporal property is used to determine the extent or all relevant temporal properties.
     */
    datetime?: string
    /**
     * integer [ 1 .. 10000 ]
     * Default: 10
     *
     * The optional limit parameter recommends the number of items that should be present in the response document.
     *
     * Only items are counted that are on the first level of the collection in the response document. Nested objects contained within the explicitly requested items must not be counted.
     *
     * Minimum = 1. Maximum = 10000. Default = 10.
     */
    limit?: number
    /**
     *
     * Array of strings (ids)
     *
     * Array of Item ids to return.
     */
    ids?: string[]
    /**
     *
     * Array of strings (collectionsArray)
     *
     * Array of Collection IDs to include in the search for items. Only Item objects in one of the provided collections will be searched
     */
    collections?: string[]

    /**
     * Geographical coordinates (lon,lat) of a place you'd like to have pictures of. Returned pictures are either 360° or looking in direction of wanted place.
     */
    place?: [number, number],
    /**
     * Maximum number of meters that the pictures might be away from `place` OR an array giving [min_distance, max_distance]
     */
    place_distance?: number | [number,number]



    /**
     * integer
     * (query)
     *
     *
     * Tolerance on how much the place should be centered in nearby pictures:
     *
     *     A lower value means place have to be at the very center of picture
     *     A higher value means place could be more in picture sides
     *
     * Value is expressed in degrees (from 2 to 180, defaults to 30°), and represents the acceptable field of view relative to picture heading. Only used if place_position parameter is defined.
     *
     * Example values are:
     *
     *     <= 30° for place to be in the very center of picture
     *     60° for place to be in recognizable human field of view
     *     180° for place to be anywhere in a wide-angle picture
     *
     * Note that this parameter is not taken in account for 360° pictures, as by definition a nearby place would be theorically always visible in it.
     */
    place_fov_tolerance?: number
    /**
     * Array of numbers or Array of numbers
     *
     * Only features that have a geometry that intersects the bounding box are selected. The bounding box is provided as four or six numbers, depending on whether the coordinate reference system includes a vertical axis (height or depth):
     *
     *     Lower left corner, coordinate axis 1
     *     Lower left corner, coordinate axis 2
     *     Minimum value, coordinate axis 3 (optional)
     *     Upper right corner, coordinate axis 1
     *     Upper right corner, coordinate axis 2
     *     Maximum value, coordinate axis 3 (optional)
     *
     * The coordinate reference system of the values is WGS 84 longitude/latitude (http://www.opengis.net/def/crs/OGC/1.3/CRS84).
     *
     * For WGS 84 longitude/latitude the values are in most cases the sequence of minimum longitude, minimum latitude, maximum longitude and maximum latitude. However, in cases where the box spans the antimeridian the first value (west-most box edge) is larger than the third value (east-most box edge).
     *
     * If the vertical axis is included, the third and the sixth number are the bottom and the top of the 3-dimensional bounding box.
     *
     * If a feature has multiple spatial geometry properties, it is the decision of the server whether only a single spatial geometry property is used to determine the extent or all relevant geometries.
     *
     * Example: The bounding box of the New Zealand Exclusive Economic Zone in WGS 84 (from 160.6°E to 170°W and from 55.95°S to 25.89°S) would be represented in JSON as [160.6, -55.95, -170, -25.89] and in a query as bbox=160.6,-55.95,-170,-25.89.
     */
    bbox?: [number, number, number, number]
}

export const REPORT_REASONS = ["blur_missing",
    "blur_excess",
    "inappropriate",
    "privacy",
    "picture_low_quality",
    "mislocated",
    "copyright",
    "other"] as const

export type ReportReason = typeof REPORT_REASONS [number]

export interface Report {
    id: string,
    issue: ReportReason,
    status: "open" | "open_autofix" | "waiting" | "closed_solved" | "closed_ignored",
    picture_id: string,
    sequence_id: string,
    /**
     * Timestamp, iso-date
     */
    ts_opened: string
    reporter_account_id: string,
    reporter_comments?: string
}

/**
 * Panoramax.xyz is a centralized service which aggregates many servers
 */

export class Panoramax {
    public readonly host: string;
    private readonly timeoutAfterMs: number

    constructor(url: string = "https://panoramax.openstreetmap.fr/", timeoutMs: number = 10000) {
        if (!url.endsWith("/")) {
            url += "/"
        }
        if (!url.endsWith("api/")) {
            url += "api/"
        }
        this.host = url;
        this.timeoutAfterMs = timeoutMs
        new URL(url) // Validate the URL
    }


    public static readonly idFormat = /[a-z0-9]{8}-([a-z0-9]{4}-){3}[a-z0-9]{12}/

    /**
     * Checks if a given string follows the panoramax id format
     * @param id
     */
    public static isId(id: string): boolean {
        return id.match(Panoramax.idFormat) !== null
    }

    public async fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
        init ??= {}
        init.signal ??= AbortSignal.timeout(this.timeoutAfterMs)
        if (url.startsWith("/")) {
            url = this.host + url
        }
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
            baseUrl: this.host
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

    public url(...endpoint: (string | number)[]): string {
        return this.host + endpoint.join("/") + "/"
    }

    /***
     The response contains the JWT token, and this token can be saved, but won't be usable until someone claims it with /auth/tokens/claims/:id

     The response contains the claim route as a link with rel=claim
     */
    public async generateToken(description: string): Promise<Token> {
        return this.fetchJson<Token>(this.url("auth", "tokens", "generate") + "?description=" + encodeURIComponent(description), {
            method: "POST",
        })
    }

    /**
     * Searches for a single picture with the given ID. Uses `search` if no sequence ID is given
     * @param imageId
     * @param sequenceId
     */
    public async imageInfo(imageId: string, sequenceId?: string): Promise<ImageData> {
        if (!Panoramax.isId(imageId)) {
            throw "Invalid imageId: " + imageId
        }
        if (sequenceId && !Panoramax.isId(sequenceId)) {
            throw "Invalid sequenceId: " + sequenceId
        }
        let imageData: ImageData
        if (sequenceId) {
            imageData = await this.fetchJson<ImageData>(this.url("collections", sequenceId, "items", imageId))
        } else {
            imageData = (await this.search({
                ids: [imageId]
            }))?.[0]
        }
        const a = imageData.assets
        imageData.assets.sd = this.makeAbsolute(a.sd)
        imageData.assets.hd = this.makeAbsolute(a.hd)
        imageData.assets.thumb = this.makeAbsolute(a.thumb)

        return imageData
    }

    private makeAbsolute(l: AssetLink): AssetLink {
        if (l.href.startsWith("/")) {
            const host = new URL(this.host)
            const href = host.protocol + "//" + host.host + "/" + l.href
            return {
                ...l,
                href
            }
        }
        return l
    }

    public login(token: string): AuthorizedPanoramax {
        return new AuthorizedPanoramax(this.host, token, this.timeoutAfterMs)
    }

    /**
     * Report a picture as inappropriate and request deletion from the server
     */
    public report(data: {
        issue: ReportReason,
        picture_id: string,
        reporter_comments?: string,
        reporter_email?: string,
        sequence_id: string
    }): Promise<Report> {
        return this.fetchJson(
            this.url("reports"),
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            }
        )
    }

    /**
     * Searches all pictures matching the given filter
     *
     * Uses https://api.stacspec.org/v1.0.0/item-search/#tag/Item-Search
     */
    public async search(filters: SearchOptions): Promise<ImageData[]> {
        const options: string[] = []
        if (filters["bbox"]) {
            options.push("bbox=" + filters.bbox.join(","))
        }
        if (filters.place) {
            options.push("place_position=" + filters.place[0] + "," + filters.place[1] + "")
            if (filters.place_distance) {
                if(Array.isArray(filters.place_distance)){
                    options.push("place_distance=" + filters.place_distance.join("-"))
                }else{
                    options.push("place_distance=0-" + filters.place_distance)
                }
            }
            if (filters.place_fov_tolerance) {
                options.push("place_fov_tolerance=" + filters.place_fov_tolerance)
            }
            if (filters.bbox) {
                throw "Invalid combination: either use 'place' OR 'bbox' but not both"
            }
        }
        if (filters.ids) {
            for (const id of filters.ids) {
                if (!Panoramax.isId(id)) {
                    throw "Invalid id in `ids`-list: " + id
                }
            }
            options.push("ids=" + filters.ids.join(","))
        }
        if (filters.collections) {
            for (const id of filters.collections) {
                if (!Panoramax.isId(id)) {
                    throw "Invalid id in `collections`-list: " + id
                }
            }
            options.push("collections=" + filters.collections.join(","))
        }

        if (filters.limit) {
            options.push("limit=" + filters.limit)
        }
        if (filters.datetime) {
            options.push("datetime=" + filters.datetime)
        }
        let body: object | undefined = undefined
        if (filters.intersects) {
            body = {
                intersects: filters.intersects
            }
        }
        const url = this.url("search") + "?" + options.join("&")

        let result: { features: ImageData[] }
        if (body) {
            result = await this.fetchJson(url, {
                headers: {
                    "request:type": "application/json"
                },
                body: JSON.stringify(body)
            })
        } else {
            console.log(url)
            result = await this.fetchJson(url)
        }
        return result.features
    }

    /**
     * Constructs a link to open in the browser, focusing on the given picture
     */
    public createViewLink(options: {
        imageId?: string | undefined,
        location?: { lon: number, lat: number },
        zoom?: 15 | number
        focus?: "pic" | "map"
    }) {
        const host = new URL(this.host).host

        if (options.imageId && !Panoramax.isId(options.imageId)) {
            throw "Invalid imageId: " + options.imageId
        }

        let url = "https://" + host + "/#"
        const qp: string[] = []
        let focus: string | undefined = options.focus
        if (options.imageId) {
            focus ??= "pic"
            qp.push("pic=" + options.imageId)
        }
        if (options.location) {
            focus ??= "map"
            qp.push("map=" + (options.zoom ?? 15) + "/" + (options.location.lat) + "/" + options.location.lon)
        }

        if (focus) {
            qp.push("focus=" + focus)
        }
        return url + qp.join("&")
    }
}

export class PanoramaxXYZ extends Panoramax {

    constructor(host = "https://api.panoramax.xyz/api/") {
        super(host)
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

export interface AddImageOptions  {
    datetime?: string,
    lon?: number, // WGS84
    lat?: number, // WGS84
    exifOverride?: Record<string, string>,
    isBlurred?: boolean,
    onProgress?: (progress: ProgressEvent) => void,
    indexInSequence?: number
}

export class AuthorizedPanoramax extends Panoramax {
    private readonly _bearerToken: string;


    /**
     * To get a bearer token, go to your panoramax instance > settings and copy the token
     * @param url
     * @param bearerToken
     */
    constructor(url: string, bearerToken: string, timeout?: number) {
        super(url, timeout);
        this._bearerToken = bearerToken;
    }

    public addAuthHeaders(headers: Record<string, string> = {}) {
        headers = {...headers}
        headers["Authorization"] = "Bearer " + this._bearerToken
        return headers
    }

    public async fetch(url: string, init: RequestInit | undefined = undefined) {
        init ??= <RequestInit>{}
        init.headers = this.addAuthHeaders(<Record<string, string>>init.headers)
        if (url.startsWith("/")) {
            url = this.host + url
            url = url.replace("//", "/")
        }
        return await fetch(url, init)
    }

    async fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
        const res = await this.fetch(url, init);

        if (!res.ok) {
            throw new Error(res.status + " " + res.statusText + ": " + await res.text());
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

    /**
     * Upload a single image to the specified collection
     */
    public async addImage(image: Blob, sequenceId: string, options?: AddImageOptions): Promise<Feature<Point> & { id: string }> {
        return new Promise((resolve, reject) => {
            const body = new FormData()
            body.append("isBlurred", options?.isBlurred ? "true" : "false")
            if (options?.indexInSequence !== undefined) {
                body.append("position", "" + options.indexInSequence)
            }
            if (options?.lat) {
                body.append("override_latitude", "" + options.lat)
            }
            if (options?.lon) {
                body.append("override_longitude", "" + options.lon)
            }
            if (options?.datetime) {
                body.append("override_capture_time", "" + options.datetime)
            }

            for (const key in options?.exifOverride ?? {}) {
                const value = options?.exifOverride?.[key]
                if (value) {
                    body.append("override_Exif.Image." + key, value)
                }
            }

            body.append("picture", image)

            const xhr = new XMLHttpRequest();
            if (options?.onProgress !== undefined) {
                xhr.upload.addEventListener("progress", (ev) => {
                    const f: ((progress: ProgressEvent) => void) | undefined = options.onProgress
                    if (f) {
                        f(ev)
                    }
                })
            }
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error(xhr.statusText));
                }
            };
            xhr.onerror = function () {
                reject(new Error("Network error"));
            };
            xhr.open("POST", this.url("collections", sequenceId, "items"));
            const headers = this.addAuthHeaders()
            for (const key in headers) {
                xhr.setRequestHeader(key, headers[key])
            }
            xhr.send(body);
        })
    }

}