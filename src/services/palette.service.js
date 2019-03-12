
const Rainbow = require('rainbowvis.js');

const PaletteService = {

    PALETTES: [
        {
            paletteId: "cirana",
            rangeValues: { min: 0, max: 1.5 },
            step: 0.01,
            spectrum: ['#ff00ff', '#00ffff', '#ffff00', '#ff6400', '#ff3c00', '#ff2800', '#ff1400', '#c80000', '#9b0000', '#460000', '#000000']
        },
        {
            paletteId: "atmosfera",
            rangeValues: { min: 0, max: 20 },
            step: 0.1,
            spectrum: ['#0a246a', '#0002f5', '#0072ff', '#00f2ff', '#32ffa8', '#6fff43', '#fff900', '#ffa200', '#ff6d00', '#c20000', '#030000']
        },
        {
            paletteId: "wave_med",
            rangeValues: { min: 0, max: 6 },
            step: 0.1,
            spectrum: ['#0a246a', '#0002f5', '#0072ff', '#00f2ff', '#32ffa8', '#6fff43', '#fff900', '#ffa200', '#ff6d00', '#c20000', '#030000']
        },
        {
            paletteId: "wave_atl",
            rangeValues: { min: 0, max: 10 },
            step: 0.1,
            spectrum: ['#0a246a', '#0002f5', '#0072ff', '#00f2ff', '#32ffa8', '#6fff43', '#fff900', '#ffa200', '#ff6d00', '#c20000', '#030000']
        }
    ],

    getColor(paletteId, value) {
        var palette = this.PALETTES.find(p => p.paletteId == paletteId);
        var numberOfItems = (palette.rangeValues.max - palette.rangeValues.min) / palette.step;
        var position = ((value - palette.rangeValues.min) * numberOfItems) / palette.rangeValues.max;
        var rainbow = new Rainbow(); 
        rainbow.setNumberRange(1, numberOfItems);
        rainbow.setSpectrum(...palette.spectrum);
        var color = rainbow.colourAt(position);
        return color;
    }
}

export default PaletteService

