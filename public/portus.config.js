
 window.PC = {
    
    // Checkboxes disponibles
    map_options: ["pred_nivmar", "pred_corrientes", "pred_temperatura", "pred_viento", "pred_salinidad", "tr_oleaje"],,

    // Opciones iniciales del mapa
    // España: [-19.204102, 30.675715, 5.009766, 46.195042]
    // Estrecho Gibraltar: -6.440735,35.525521,-4.416504,36.498597
    // Europa:  [-33.574219, 23.402765, 50.273438, 59.175928]npm
    map_initial_bounds: [-19.204102, 30.675715, 5.009766, 46.195042], 
    map_initial_zoom: 5,

    // Opciones del layer base
    base_layer: "https://khms0.googleapis.com/kh?v=812&hl=es&x={x}&y={y}&z={z}",
    base_layer_min_zoom: 1,
    base_layer_max_zoom: 17,

    // Opciones de layout
    options_panel_align: 'left'

}



