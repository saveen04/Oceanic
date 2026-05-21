import { ready, File } from "h5wasm/node";
import path from "path";

async function inspect() {
    await ready;
    const filePath = path.join(process.cwd(), "datasets", "cmems_mod_glo_phy_anfc_0.083deg-sst-anomaly_P1D-m_1773642933812.nc");
    const file = new File(filePath, "r");
    const ds = file.get("sea_surface_temperature_anomaly");
    console.log("Shape:", ds.shape);
    const data = ds.value;
    
    let sum = 0, count = 0, min = 100, max = -100;
    for(let i=0; i<data.length; i++) {
        const v = data[i];
        if (v > -100 && v < 100) {
            sum += v;
            count++;
            if (v < min) min = v;
            if (v > max) max = v;
        }
    }
    console.log("Stats: count=", count, "avg=", sum/count, "min=", min, "max=", max);
    
    const lats = file.get("latitude").value;
    const lons = file.get("longitude").value;
    console.log("Lat range:", lats[0], "to", lats[lats.length-1]);
    console.log("Lon range:", lons[0], "to", lons[lons.length-1]);
    
    file.close();
}

inspect();
