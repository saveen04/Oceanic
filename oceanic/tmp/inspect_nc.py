import netCDF4 as nc
import json
import os

file_path = r'd:\Oceanic\oceanic\datasets\cmems_mod_glo_phy_anfc_0.083deg-sst-anomaly_P1D-m_1773642933812.nc'

try:
    ds = nc.Dataset(file_path)
    print(f"File format: {ds.file_format}")
    
    # Print variables
    print("\nVariables:")
    for var_name in ds.variables:
        var = ds.variables[var_name]
        print(f"  {var_name}: {var.dimensions}, shape={var.shape}, dtype={var.dtype}")
        for attr in var.ncattrs():
            print(f"    {attr}: {var.getncattr(attr)}")

    # Print dimensions
    print("\nDimensions:")
    for dim_name in ds.dimensions:
        dim = ds.dimensions[dim_name]
        print(f"  {dim_name}: size={len(dim)}")

    # Specific check for Indian Ocean / Arabian Sea / Bay of Bengal regions
    # Lat: -10 to 30, Lon: 30 to 100 roughly
    
    ds.close()
except Exception as e:
    print(f"Error: {e}")
