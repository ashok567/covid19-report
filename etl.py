import pandas as pd
import requests
from io import BytesIO
import yaml

with open('config.yml', 'r') as config_file:
    try:
        config = yaml.safe_load(config_file)
    except yaml.YAMLError as exc:
        print(exc)


response = requests.get(config['url'])
data = response.content


def statewise_count():
    statewise_df = pd.read_excel(BytesIO(data),
                                 sheet_name='Statewise', encoding='utf-8')
    statewise_df['Delta_Total'] = statewise_df['Delta_Confirmed']
    + statewise_df['Delta_Recovered'] + statewise_df['Delta_Deaths']
    statewise_df = statewise_df.to_json(orient='records')
    return statewise_df


def daily_count():
    daily_df = pd.read_excel(BytesIO(data),
                             sheet_name='Statewise_Daily', encoding='utf-8')
    daily_df = daily_df.groupby(['Date', 'Status'])['TT'].sum().reset_index()
    daily_df.rename(columns={'TT': 'Count'}, inplace=True)
    # daily_df['Active'] = daily_df['Confirmed']
    # + daily_df['Recovered'] + daily_df['Deaths']
    daily_df = daily_df.to_json(orient='records')
    return daily_df
