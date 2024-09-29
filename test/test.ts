import {Panoramax, PanoramaxXYZ} from "../src/Panoramax";

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
        const threeD = await new PanoramaxXYZ().search({
            ids:["611cbc5d-36e5-4c62-8660-18c14f66fdc0","0953fc35-9f70-4f93-9858-845dc51eb3a3"]
        })
        console.log(threeD)
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