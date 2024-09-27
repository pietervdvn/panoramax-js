import {AuthorizedPanoramax, ImageData, Panoramax} from "../src/Panoramax";
import {FeatureCollection} from "geojson";

async function test() {
    try {

        const urlbe = "https://panoramax.mapcomplete.org/"
        const tokenBe="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnZW92aXNpbyIsInN1YiI6IjU5ZjgzOGI0LTM4ZjAtNDdjYi04OWYyLTM3NDQ3MWMxNTUxOCJ9.0rBioZS_48NTjnkIyN9497c3fQdTqtGgH1HDqlz1bWs"


        const authBe = new AuthorizedPanoramax(urlbe, tokenBe)
        const mySequences = await authBe.mySequences()
        const sequenceId = mySequences[0].id
        const sequence = await authBe.fetchJson<FeatureCollection>(authBe.url("collections", sequenceId, "items"))
        const item = < ImageData>sequence.features[3]
        const itemInfo = await authBe.imageInfo(sequenceId, item.id)
        console.log(itemInfo)
    } catch (e) {
        console.error(e)
    }
}


test()