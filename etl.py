import pandas as pd
import requests
from io import BytesIO
import yaml


with open('config.yml', 'r') as config_file:
    try:
        config = yaml.safe_load(config_file)
    except yaml.YAMLError as exc:
        print(exc)


# response = requests.get(config['url'])
# data = response.content


def statewise_count():
    response = requests.get(config['state_wise'])
    data = response.content
    statewise_df = pd.read_csv(BytesIO(data), encoding='utf-8')
    statewise_df = statewise_df.drop(
        ['Last_Updated_Time', 'State_Notes'], axis=1)
    statewise_df['Delta_Total'] = statewise_df['Delta_Confirmed']
    + statewise_df['Delta_Recovered'] + statewise_df['Delta_Deaths']
    statewise_df = statewise_df.to_json(orient='records')
    return statewise_df


def daily_count():
    response = requests.get(config['case_time_series'])
    data = response.content
    daily_df = pd.read_csv(BytesIO(data), encoding='utf-8')
    daily_df['Date'] = daily_df['Date'].str.strip()
    daily_df = daily_df.to_json(orient='records')
    return daily_df


daily_count()
