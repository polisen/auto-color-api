import chroma from 'chroma-js';
import KMeans from './3d_Kmeans'
function mod(x: number, m: number) {
    return (x%m + m)%m;
}

function extractHSL(hslString: string){
    return hslString.replace('hsl(', '').replace(')','').split(',').map(val => Number(val.trim().replace('%','')))
}

function getHues(hue: number, method: string){
    switch(method) {
        case 'triad':
            return [mod(hue + 120, 360), mod(hue + 240, 360)]
        case 'complement':
            return [mod(hue + 180, 360)]
        default: return [hue]
    }
}


export const get1dComplements = (palette: string[], method: string) => {
    let complements: any[] = []
    let paletteHSL: any[] = []
    palette.forEach(c => {
        let [h,s,l] = extractHSL(c);
        paletteHSL.push([h,s,l])
        let hueComplements = getHues(h, method);
        hueComplements.forEach(h2 => complements.push([h2,s / 100,l / 100]))
    })
    // console.debug({complements});
    let centroids = KMeans(complements.map(([h]) => h))
    // console.debug(ClusteredHues);
    return centroids.sort((a,b) => a[0] - b[0]).map(([h,s,l]) => chroma.hsl(h, s, l).hex())
}


export const getComplements = (palette: string[], method: string) => {
    // console.debug({palette});
    let complements: any[] = []
    let paletteHSL: any[] = []
    palette.forEach(c => {
        let [h,s,l] = extractHSL(c);
        paletteHSL.push([h,s,l])
        let hueComplements = getHues(h, method);
        hueComplements.forEach(h2 => complements.push([h2 / 360,s / 100,l / 100]))
    })
    let centroids = KMeans(complements)
    return centroids.sort((a,b) => a[0] - b[0]).map(([h,s,l]) => chroma.hsl(Math.floor(h * 360), s, l).hex())
}