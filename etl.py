import pandas as pd 
import requests
from io import StringIO, BytesIO
import yaml

with open('config.yml', 'r') as config_file:
    try:
        config = yaml.safe_load(config_file)
    except yaml.YAMLError as exc:
        print(exc)

def statewise_count():
    response = requests.get(config['url'])
    data = response.content
    # df1 = pd.read_excel(BytesIO(data), sheet_name='Raw_Data', encoding='utf-8')
    statewise_df = pd.read_excel(BytesIO(data), sheet_name='Statewise', encoding='utf-8')
    statewise_df = statewise_df.to_json(orient='records')
    return statewise_df