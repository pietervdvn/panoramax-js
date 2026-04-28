import {describe, expect, test} from '@jest/globals';
import {PanoramaxXYZ} from "../src";


describe('integration tests - depend on panoramax.mapcomplete.org and api.panoramax.xyz', () => {
    test('searching for images yields images', async () => {
        const images = await new PanoramaxXYZ().search({
            ids: ["611cbc5d-36e5-4c62-8660-18c14f66fdc0", "0953fc35-9f70-4f93-9858-845dc51eb3a3"]
        })
        expect(images.length).toBeGreaterThan(0)
    });

});