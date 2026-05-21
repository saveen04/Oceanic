import netCDF4 as nc
import json
import numpy as np

file_path = r'd:\Oceanic\oceanic\datasets\cmems_mod_glo_phy_anfc_0.083deg-sst-anomaly_P1D-m_1773642933812.nc'

try:
    ds = nc.Dataset(file_path)
    
    info = {
        "variables": {},
        "dimensions": {}
    }
    
    for dim_name in ds.dimensions:
        info["dimensions"][dim_name] = len(ds.dimensions[dim_name])
        
    for var_name in ds.variables:
        var = ds.variables[var_name]
        var_info = {
            "dimensions": var.dimensions,
            "shape": [int(s) for s in var.shape],
            "dtype": str(var.dtype),
            "attributes": {attr: str(var.getncattr(attr)) for attr in var.ncattrs()}
        }
        
        # Get range for coordinates
        if var_name in ['latitude', 'longitude']:
            var_info["min"] = float(np.min(var[:]))
            var_info["max"] = float(np.max(var[:]))
            
        info["variables"][var_name] = var_info

    print(json.dumps(info, indent=2))
    ds.close()
except Exception as e:
    print(f"Error: {e}")
