# panoramax-js

Simple panoramax SDK to upload pictures and use some common API-endpoints in a typed way.

This library is developed for (and used by) https://MapComplete.org and the corresponding [mastodon bot](https://botsin.space/@mapcomplete).
As such, it implements the methods what those projects need and nothing much more.

Do you want to use it in your project and is something missing? Feel free to add functionality and do a pull request.


## Usage

```
const p = new Panoramax("https://panoramax.openstreetmap.fr")
const defaultSequence = (await p.mySequences())[0]
const img = <ImageData>await p.addImage(blob, defaultSequence, {

            // lat, lon and datetime should be in the EXIF-data. If they are not (or they are incorrect), one can set them manually or override them
            // You can use e.g. ExifReader to check this
            lat: !hasGPS ? lat : undefined,
            lon: !hasGPS ? lon : undefined,
            datetime: !hasDate ? new Date().toISOString() : undefined,
            
            exifOverride: { // optional, if you want to add an extra author to the file
                Artist: author,
            },

        })
```