import pandas as pd

df = pd.read_stata('28762-0001-Data.dta')

df.to_csv('28762-0001-Data.csv', index=False)