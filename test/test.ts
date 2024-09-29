import {AuthorizedPanoramax, ImageData, Panoramax} from "../src/Panoramax";
import {FeatureCollection} from "geojson";

async function test() {
    try {
        const urlbe = "https://panoramax.mapcomplete.org/"
        const urlfr = "https://panoramax.openstreetmap.fr"
        const p = new Panoramax(urlbe)
        // https://panoramax.mapcomplete.org/api/map/15/16724/10962.mvt
        const images = await p.search({
            bbox: [3.736408390064696,
                51.05628597975769
,
                3.7530055931402444,
            51.04743527668026]
        })
        console.log(images)
        /*
                const tokenBe="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnZW92aXNpbyIsInN1YiI6IjU5ZjgzOGI0LTM4ZjAtNDdjYi04OWYyLTM3NDQ3MWMxNTUxOCJ9.0rBioZS_48NTjnkIyN9497c3fQdTqtGgH1HDqlz1bWs"
                const authBe = new AuthorizedPanoramax(urlbe, tokenBe)
                const mySequences = await authBe.mySequences()
                const sequenceId = mySequences[0].id
                const url = await authBe.imageInfo(sequenceId, "30f257f4-65c8-4df7-98fc-5b9218b2dc77")
                console.log(url.assets.hd)*/
    } catch (e) {
        console.error(e)
    }
}


test()