from math import sin, cos
import pandas as pd
import json

def read_csv_file(path_to_file):
    df = pd.read_csv(path_to_file)

    data = []
    rows = len(df)

    for i in range(rows):
        source = {}
        source['id'] = str(i)
        delta = 0
        alpha = 0
        for headers in df:
            value = df[headers][i]
            try:
                if(headers == 'RA (h)'):
                    delta += float(value) * 15
                elif(headers == 'RA (min)'):
                    delta += float(value) / 4
                elif(headers == 'RA (sec)'):
                    delta += float(value) / 240
                elif(headers == 'DE (deg)'):
                    alpha += float(value)
                elif(headers == 'DE (arcmin)'):
                    alpha += float(value) / 60
            except:
                print(value, headers, path_to_file, i)
            
            source[headers] = str(df[headers][i])
        x = cos(delta) * cos(alpha)
        y = cos(delta) * sin(alpha)
        z = sin(delta)
        source['x'] = x
        source['y'] = y
        source['z'] = z
        data.append(source)

    return data

high_energy_data_path = './processed_data/High Energy.csv'
low_energy_data_path = './processed_data/Low Energy.csv'
high_energy_filename = './sources_data_json/high_energy_sources.json'
low_energy_filename = './sources_data_json/low_energy_sources.json'

high_energy_sources = read_csv_file(high_energy_data_path)
json_data_high = json.dumps(high_energy_sources, indent=2)
with open(high_energy_filename, 'w') as json_file:
    try:
        json_file.write(json_data_high)
        print("File was saved successfully!")
    except:
        print("Oops! file could not be saved :/")

low_energy_sources = read_csv_file(low_energy_data_path)
json_data_low = json.dumps(low_energy_sources, indent=2)
with open(low_energy_filename, 'w') as json_file:
    try:
        json_file.write(json_data_low)
        print("File was saved successfully!")
    except:
        print("Oops! file could not be saved :/")
