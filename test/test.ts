import {AuthorizedPanoramax, Panoramax} from "../src/Panoramax";

async function test() {
    try {

        const urlbe = "https://panoramax.mapcomplete.org/"
        const tokenBe= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnZW92aXNpbyIsInN1YiI6IjU5ZjgzOGI0LTM4ZjAtNDdjYi04OWYyLTM3NDQ3MWMxNTUxOCJ9.0rBioZS_48NTjnkIyN9497c3fQdTqtGgH1HDqlz1bWs\""
        const tokenBePersonal = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnZW92aXNpbyIsInN1YiI6ImU2YzVkZGZhLTYyYWEtNDY2Ny05YTcyLTM0ZjU5NWI2MTZkNCJ9.KXu1JMVfzwU9LoSn153a2oO7XRgai-Th5-Oo7vfEzqE"
        // const token = await fr.getLoginTokenFromOpenStreetMap("n4DkmchQr5zsCMBbVYBKiuuJ1H53QXpQ7RzOSx8vD-A")
        // const token = await fr.generateToken("test")

        const urlfr = "https://panoramax.openstreetmap.fr"
        const tokenFr= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnZW92aXNpbyIsInN1YiI6IjdiMTAwNzI0LWY3MGUtNGEwZS05MjNhLTg0OWVhMzYxYTNlMCJ9.YRFzO6hlx3ogAvbctpGswLxcB8uZYLk17TQd_NCJm1Y"

        const auth = new AuthorizedPanoramax(urlfr, tokenFr)
        const authBe = new AuthorizedPanoramax(urlbe, tokenBePersonal)
//await authBe.createCollection("test")
        const mySequences = await authBe.mySequences()

        console.log(mySequences)
    } catch (e) {
        console.error(e)
    }
}


test()