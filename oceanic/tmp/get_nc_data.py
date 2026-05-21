import netCDF4 as nc
import numpy as np

file_path = r'd:\Oceanic\oceanic\datasets\cmems_mod_glo_phy_anfc_0.083deg-sst-anomaly_P1D-m_1773642933812.nc'

try:
    ds = nc.Dataset(file_path)
    lats = ds.variables['latitude'][:]
    lons = ds.variables['longitude'][:]
    
    print(f"Latitude Range: {np.min(lats)} to {np.max(lats)} (size: {len(lats)})")
    print(f"Longitude Range: {np.min(lons)} to {np.max(lons)} (size: {len(lons)})")
    
    var_name = 'analysed_sst_anomaly'
    if var_name in ds.variables:
        var = ds.variables[var_name]
        print(f"Variable: {var_name}")
        print(f"Shape: {var.shape}")
        if hasattr(var, 'scale_factor'):
            print(f"Scale Factor: {var.scale_factor}")
        if hasattr(var, 'add_offset'):
            print(f"Add Offset: {var.add_offset}")
        if hasattr(var, 'units'):
            print(f"Units: {var.units}")
            
    ds.close()
except Exception as e:
    print(f"Error: {e}")
