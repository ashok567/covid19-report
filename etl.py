import pandas as pd
import requests
from io import BytesIO
import yaml

with open('config.yml', 'r') as config_file:
    try:
        config = yaml.safe_load(config_file)
    except yaml.YAMLError as exc:
        print(exc)


def statewise_count():
    response = requests.get(config['url'])
    data = response.content
    statewise_df = pd.read_excel(BytesIO(data),
                                 sheet_name='Statewise', encoding='utf-8')
    statewise_df['Delta_Total'] = statewise_df['Delta_Confirmed']
    + statewise_df['Delta_Recovered'] + statewise_df['Delta_Deaths']
    statewise_df = statewise_df.to_json(orient='records')
    return statewise_df
